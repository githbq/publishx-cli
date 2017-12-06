import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 撤消代码修改 并 拉取远程服务器对应分支的代码
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const currentBranchName = await getCurrentBranchName()//当前项目分支名
    data.branch = data.branch || currentBranchName
    data.origin = data.origin || 'origin'
    const cmdStr = `git clean -df && git checkout . && git pull ${data.origin} ${data.branch}`
    consoleColor.start(cmdStr)
    consoleColor.time('耗时')
    try {
      await exec(cmdStr)
    } catch (e) {
    }
    consoleColor.timeEnd('耗时')
  },
  command: ['pull', 'git pull [origin] <current branch>', {
    branch: {
      alias: ['b'],
      string: true,
      describe: '分支名 不填则取当前分支'
    },
    origin: {
      alias: ['o'],
      string: true,
      describe: '对应远程的名称 默认为origin'
    },
  }]
}
