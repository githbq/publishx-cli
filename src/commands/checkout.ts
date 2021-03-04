import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'
import show from './show'

/**
 * git checkout
 */
export default {
  /**
   * 启动
   */
  async start({ name, branch }) {
    const pathModels = await show.findProjectPaths()

    const promises = pathModels.map(async (n) => {
      if (!n.isGit) {
        consoleColor.red(`工程:${n.path} 非git工程，跳过`)
        return Promise.resolve()
      }
      const cmdStr = `git remote update && git checkout ${branch ? '-b' : ''} ${name}`
      consoleColor.start(cmdStr)
      try {
        await exec(cmdStr, { cwd: n.path })
      }
      catch (e) {
        consoleColor.red(`发生异常:${e.message}`, false)
      }
    })
    await Promise.all(promises)

  }, command:
    [
      '<name>', 'git remote update && git checkout <branchName>',
      {
        branch: {
          alias: ['b'],
          boolean: true,
          describe: '创建 并切换到新分支'
        },
      }
    ]
}
