import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 推送代码到远程服务器
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const cmdStr = `git add . && git commit -am "${data.comment}" ${data.noVerify ? '--no-verify' : ''}`
    consoleColor.start(cmdStr) 
    try {
      await exec(cmdStr)
    }
    catch (e) {
      // consoleColor.red(`发生异常:${e.message}`, false)
    } 
  },
  command: [
    '<comment>', 'git add . && git commit -am [comment] --no-verify?',
    {
      noVerify: {
        alias: ['n'],
        boolean: true,
        describe: '是否不验证 --no-verify'
      }
    }
  ]
}
