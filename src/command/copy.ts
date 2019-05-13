import * as Listr from 'listr'
import { Observable } from 'rxjs'
import *  as  BlueBird from 'bluebird'
import { _, exec, cwd, consoleColor, io } from '../lib'
import show from './show'



/**
 * 复制项目
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        let dir = data.target
        if (io.isSubDir(cwd, dir)) {
            consoleColor.red(`目标路径 [${dir}] 不能当前目录的子目录 请使用 ../ 或者  绝对路径`)
            return
        }
        consoleColor.time('总耗时')
        //找到所有package.json
        let pathModels = await show.findProjectPaths(data.all)

        if (!data.all) {
            //排除嵌套关系的 过滤掉子项目 _.remove是对数组作修改 返回的是被remove数组
            _.remove(pathModels, (n) => pathModels.some(m => io.isSubDir(m.path, n.path)))
        } else {
            data.noCommit = true
        }
        let count = 0
        const tasks = []
        if (data.all) {
            let concurrency = 20
            consoleColor.time(`删除目标文件夹${dir}`)
            await io.rimraf(io.pathTool.resolve(dir))
                .catch(() => { })
            consoleColor.timeEnd(`删除目标文件夹${dir}`)
            // 表示直接复制文件，而非以项目的方式
            const spiner = consoleColor.showSpiner(`开始以${concurrency}个文件并行的方式复制所有文件到目标文件夹=>${data.target}`)
            let fileCount = pathModels.length

            await BlueBird.map(pathModels, (pathModel) => {
                const relativePath = io.pathTool.relative(cwd, pathModel.path)
                const fileTartgetPath = io.pathTool.join(dir, relativePath)

                return io.copy(pathModel.path, fileTartgetPath)
                    .then(() => {
                        fileCount--
                        spiner.info(`剩余${fileCount}个文件`)
                    }, (error) => {
                        fileCount--
                        spiner.info(`error:${relativePath}，还剩余${fileCount}个文件`)
                    })
            }, { concurrency })
            spiner.ok(`所有${pathModels.length}个文件复制完毕`)
            consoleColor.green(`\n cd ${data.target}`)
        } else {
            for (let p of pathModels) {
                tasks.push({
                    title: `[${++count}]: copy ${p.path} to ${io.pathTool.join(io.pathTool.join(dir, p.path))} `,
                    task: () => {
                        return this.copy(dir, p, data.noCommit).catch(() => { })
                    }
                })
            }
            /**
             * concurrent并发执行任务
             */
            const taskManager = new Listr(tasks, { concurrent: data.concurrent })
            await taskManager.run()
        }
        consoleColor.timeEnd('总耗时')
        consoleColor.green('复制 完毕\n\n', true)
    },
    async copy(dir, p, noCommit) {
        const commitCmdStr = `git add . && git commit -am "commit for copy"`
        let projectFiles
        const targetPath = io.pathTool.join(dir, p.path)
        return new Observable((observer) => {
            observer.next(`deleting: ${targetPath}`)
            io.delete(io.pathTool.resolve(targetPath))
                .catch(() => { })
                .then(() => {
                    return io.globby(['**/*', '!**/{node_modules,types,build,temp,dist}/**'], { dot: true, cwd: p.path, nodir: true, absolute: true })
                })
                .catch(() => { })
                .then(files => {
                    projectFiles = files
                    if (noCommit) {
                        return Promise.resolve()
                    }
                    observer.next(`executing: ${commitCmdStr}`)
                    return exec(commitCmdStr, { cwd: p.path, preventDefault: true })
                })
                .catch(() => { })
                .then(() => {

                    observer.next(`copying files ${p.path} > $${dir}`)
                    const copyPromises = []
                    for (let filePath of projectFiles) {
                        const relativePath = io.pathTool.relative(cwd, filePath)
                        const fileTartgetPath = io.pathTool.join(dir, relativePath)
                        copyPromises.push(io.copy(filePath, fileTartgetPath).catch(() => { }))
                    }
                    return Promise.all(copyPromises)
                })
                .catch(() => { })
                .then(() => {
                    if (noCommit) {
                        return Promise.resolve()
                    }
                    observer.next(`${targetPath} > git checkout .`)
                    return exec(`git checkout .`, { cwd: targetPath, preventDefault: true })
                })
                .catch(() => { })
                .then(() => {
                    observer.complete()
                })
        })
    },
    command: [
        'copy <target>',
        '复制项目，忽略node_modules',
        {
            concurrent: {
                alias: 'c',
                describe: '是否并行操作',
                boolean: true,
                default: false
            },
            noCommit: {
                alias: 'nc',
                describe: '不提交代码 not execute git commit',
                boolean: true,
                default: false
            },
            all: {
                alias: 'a',
                describe: '复制所有文件，不仅仅是node工程',
                boolean: true,
                default: false
            }
        }
    ]
}