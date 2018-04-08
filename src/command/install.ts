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
                task: () => {
                    const packageJson = packageHelper.get(io.pathTool.resolve(pathModel.path))
                    const { dependencies, devDependencies } = packageJson
                    const existsPackages = { ...dependencies, ...devDependencies }
                    const _PromiseTasks = []
                    Object.keys(existsPackages).forEach(key => {
                        const value = existsPackages[key]
                        let cmdStr
                        if (value.trim().indexOf('file:') !== 0) {
                            if (data.npm) {
                                cmdStr = `${tool} install ${key}@${value} --no-save --no-shrinkwrap --no-package-lock`
                            } else {
                                cmdStr = `${tool} install ${key}@${value} --no-lockfile`
                            }
                            _PromiseTasks.push({ cmdStr, options: { cwd: pathModel.path, preventDefault: true } })
                        }
                    })

                    return _Promise.map(
                        _PromiseTasks,
                        (n) => exec(n.cmdStr, n.options).catch(() => { }),
                        { concurrency: Infinity }
                    )
                }
            })
        }
        const taskManager = new Listr(tasks, { concurrent: 5 })
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