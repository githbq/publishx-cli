import { _, stringify, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
import show from './show'
import { Observable } from 'rxjs/Observable'
import * as Listr from 'listr'
import * as  delay from 'delay'
/**
 * 更新git项目
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const pathModels = await show.findProjectPaths()
        _.remove(pathModels, n => !n.isGit)
        consoleColor.time('一共耗时')
        const tasks = []
        let count = 0
        for (let pathModel of pathModels) {
            tasks.push({
                title: `[${++count}]执行 git fetch origin${data.reset ? ' && git reset --hard origin/[currentBranch]' : ''} @ ${pathModel.path}`,
                task: () => {
                    pathModel.path = io.pathTool.resolve(pathModel.path)
                    return new Observable((observer) => {
                        let currentBranch
                        getCurrentBranchName({ cwd: pathModel.path })
                            .then((branch) => {
                                currentBranch = branch
                                const cmdStr = 'git fetch origin '
                                observer.next(cmdStr)
                                return exec(cmdStr, { cwd: pathModel.path, preventDefault: true })
                            })
                            .catch(() => { })
                            .then(() => {
                                if (data.reset) {
                                    const cmdStr = `git reset --hard origin/${currentBranch}`
                                    observer.next(cmdStr)
                                    return exec(cmdStr, { cwd: pathModel.path, preventDefault: true })
                                }
                            })
                            .catch(() => { })
                            .then(() => {
                                observer.complete()
                            })
                    })
                }
            })
        }
        const taskManager = new Listr(tasks, { concurrent: true })
        await taskManager.run()
        consoleColor.timeEnd('一共耗时')
        consoleColor.green('更新完毕\n\n', true)
    },
    command: [
        'update',
        '更新当前目录下的项目',
        {
            reset: {
                alias: ['r'],
                boolean: true,
                describe: 'git reset 当前分支'
            }
        }
    ]
}