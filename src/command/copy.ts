import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
import show from './show'
import * as Listr from 'listr'
import { Observable } from 'rxjs/Observable'

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
        let pathModels = await show.findProjectPaths()
        //排除嵌套关系的 过滤掉子项目 _.remove是对数组作修改 返回的是被remove数组
        _.remove(pathModels, (n) => pathModels.some(m => io.isSubDir(m.path, n.path)))
        let count = 0
        const tasks = []
        for (let p of pathModels) {
            tasks.push({
                title: `[${++count}]: copy ${p.path} to ${io.pathTool.join(io.pathTool.join(dir, p.path))} `,
                task: () => {
                    return this.copy(dir, p).catch(() => { })
                }
            })
        }
        /**
         * concurrent并发执行任务
         */
        const taskManager = new Listr(tasks, { concurrent: data.concurrent })
        await taskManager.run()
        consoleColor.timeEnd('总耗时')
        consoleColor.green('复制 完毕\n\n', true)
    },
    async copy(dir, p) {
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
            }
        }
    ]
}