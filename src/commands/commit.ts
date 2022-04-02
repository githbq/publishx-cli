import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'


/**
 * 推送代码到远程服务器
 */
export default {
  /**
   * 启动
   */
  async start({ noVerify, comment, push }) {
    let cmdStr = `git add . && git commit -am "${comment}" ${noVerify ? '--no-verify' : ''}`
    if (push) {
      const currentBranchName = await getCurrentBranchName()//当前项目分支名
      cmdStr += ` && git push origin ${currentBranchName}`
    }
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
      },
      push: {
        alias: ['p'],
        boolean: true,
        describe: '直接push到当前origin'
      }
    }
  ]
}
