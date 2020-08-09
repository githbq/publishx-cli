import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 推送代码到远程服务器
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const arr = [
      {
        tip: '当前分支',
        cmdStr: 'git branch'
      },
      {
        tip: '本地分支列表',
        cmdStr: 'git branch -a'
      },
      {
        tip: '远程分支列表',
        cmdStr: 'git branch -r'
      }
    ] 
    for (let item of arr) {
      try {
        consoleColor.start(item.tip)
        await exec(item.cmdStr)
      }
      catch (e) {
        consoleColor.red(`发生异常:${e.message}`, false)
      }
    }   
  },
  command: [
    '显示分支信息',
    {
    }
  ]
}
