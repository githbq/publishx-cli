import { _, _Promise, exec, getCurrentBranchName, cwd, consoleColor, io, packageHelper } from '../lib'
import show from './show'
import * as Listr from 'listr'
import { Observable } from 'rxjs/Observable'
/**
 * 安装node项目库
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        consoleColor.time('总耗时')
        /**
         * 查找所有nodejs项目
         */
        const pathModels = await show.findProjectPaths()
        const tasks = []
        let tool = data.npm ? 'npm' : 'yarn'
        for (let pathModel of pathModels) {
            tasks.push({
                title: `执行 ${tool} install @ ${pathModel.path}`,
                task: async () => {
                    const packageJson = await packageHelper.get(io.pathTool.resolve(pathModel.path))
                    const { dependencies, devDependencies } = packageJson
                    const existsPackages = { ...dependencies, ...devDependencies }
                    const promiseTasks = []
                    const fileLibPromiseTasks = []
                    Object.keys(existsPackages).forEach(key => {
                        const value = existsPackages[key]
                        let cmdStr
                        let taskQueue = promiseTasks
                        if (value.trim().indexOf('file:') === 0) {
                            taskQueue = fileLibPromiseTasks
                        }
                        if (data.npm) {
                            cmdStr = `${tool} install ${key}@${value} --no-save --no-shrinkwrap --no-package-lock`
                        } else {
                            cmdStr = `${tool} install ${key}@${value} --no-lockfile`
                        }
                        taskQueue.push({ cmdStr, options: { cwd: pathModel.path, preventDefault: true } })

                    })

                    return _Promise.map(
                        [promiseTasks, ...fileLibPromiseTasks],
                        (n) => exec(n.cmdStr, n.options).catch(() => { }),
                        { concurrency: 1 }
                    )
                }
            })
        }
        const taskManager = new Listr(tasks, { concurrent: 1 })
        await taskManager.run()
        consoleColor.timeEnd('总耗时')
        consoleColor.green(`${tool} install 完毕\n\n`, true)
    },
    command: [
        'install',
        '默认执行 yarn install',
        {
            npm: {
                alias: 'n',
                describe: '使用npm安装库',
                boolean: true,
                default: false
            },
        }
    ]
}