import { _, _Promise, exec, getCurrentBranchName, cwd, consoleColor, io, packageHelper } from '../lib'
import show from './show'
import * as Listr from 'listr'
/**
 * 安装node项目库
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        consoleColor.start('rimraf **/node_modules')
        await Promise.all(
            ['**/node_modules'].map(
                pattern => io.rimraf(pattern)
            )
        )

        const pathModels = await show.findProjectPaths()
        let tasks = []
        let tool = data.yarn ? 'yarn' : 'npm'
        const simpleProjects = []
        const complexProjects = []
        for (let pathModel of pathModels) {

            const packageJson = await packageHelper.get(io.pathTool.resolve(pathModel.path))
            const { dependencies, devDependencies } = packageJson
            const packages = { ...dependencies, ...devDependencies }

            const isComplex = Object.values(packages).some((url: String) => url.trim().indexOf('file:') === 0)
            let cmdStr = ''
            if (data.yarn) {
                cmdStr = `${tool} install --no-save --no-lockfile`
            }
            else {
                cmdStr = `${tool} install  --no-save --no-shrinkwrap --no-package-lock`
            }
            const title = `${tool} install @ ${pathModel.path}`
            const target = isComplex ? complexProjects : simpleProjects
            target.push({ ...pathModel, cmdStr, title })
        }

        const simpleTasks = new Listr([
            ...simpleProjects.map(n => {
                return { title: n.title, task: () => exec(n.cmdStr, { cwd: n.path, preventDefault: true }).catch(error => { }) }
            })
        ], { concurrent: data.concurrent || 2 })
        const complexTasks = new Listr([
            ...complexProjects.map(n => {
                return { title: n.title, task: () => exec(n.cmdStr, { cwd: n.path, preventDefault: true }).catch(error => { }) }
            })
        ])
        if (simpleProjects.length > 0) {
            tasks.push({
                title: '安装普通工程',
                task: () => {
                    return simpleTasks
                }
            })
        }
        if (complexProjects.length > 0) {
            tasks.push({
                title: '安装有文件级依赖工程',
                task: () => {
                    return complexTasks
                }
            })
        }

        const taskManager = new Listr(tasks)
        await taskManager.run()
        consoleColor.green(`${tool} install 完毕\n\n`, true)
    },
    command: [
        '默认执行 yarn install',
        {
            npm: {
                alias: 'n',
                describe: '使用npm安装库',
                boolean: true,
                default: false
            },
            concurrent: {
                alias: 'c',
                describe: '普通工程并发安装数',
                number: true,
                default: 2
            }
        }
    ]
}