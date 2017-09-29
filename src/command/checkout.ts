import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * git checkout
 */
export default {
  /**
   * 启动
   */
  async start({ name, branch }) {
    const cmdStr = `git remote update && git checkout ${branch ? '-b' : ''} ${name}`
    consoleColor.start(cmdStr)
    consoleColor.time('耗时')
    try {
      await exec(cmdStr)
    }
    catch (e) {
      // consoleColor.red(`发生异常:${e.message}`, false)
    }
    consoleColor.timeEnd('耗时')
  }, command:
  [
    'checkout <name>', 'git remote update && git checkout <branchName>',
    {
      branch: {
        alias: ['b'],
        boolean: true,
        describe: '创建 并切换到新分支'
      },
    }
  ]
}
