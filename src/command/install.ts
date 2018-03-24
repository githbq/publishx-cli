import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
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
                    return exec(`${tool} install `, { cwd: pathModel.path, preventDefault: true }).catch(() => { })
                }
            })
        }
        const taskManager = new Listr(tasks, { concurrent: true })
        await taskManager.run()
        consoleColor.timeEnd('总耗时')
        consoleColor.green(`${tool} install 完毕\n\n`, true)
    },
    command: [
        'install',
        '执行yarn install',
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