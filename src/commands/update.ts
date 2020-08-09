import { _, stringify, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
import show from './show'
import { Observable } from 'rxjs'
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
    const tasks = []
    let count = 0
    for (let pathModel of pathModels) {
      tasks.push({
        title: `[${++count}]执行 git fetch origin${data.reset ? ' && git clean -df && git reset --hard origin/[currentBranch]' : ''} @ ${pathModel.path}`,
        task: async () => {
          pathModel.path = io.pathTool.resolve(pathModel.path)

          const currentBranch = await getCurrentBranchName({ cwd: pathModel.path })

          const cmdStr = ' git fetch origin '
          await exec(cmdStr, { cwd: pathModel.path, preventDefault: true })


          if (data.reset) {
            const cmdStr = `git clean -df && git reset --hard origin/${currentBranch}`
            return exec(cmdStr, { cwd: pathModel.path, preventDefault: true })
          }
        }
      })
    }
    const taskManager = new Listr(tasks, { concurrent: false })
    await taskManager.run()
    consoleColor.green('更新完毕\n\n', true)
  },
  command: [
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
