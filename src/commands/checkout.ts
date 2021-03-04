import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io, projectHelper } from '../lib'
import * as pathTool from 'path'
import show from './show'

/**
 * git checkout
 */
export default {
  /**
   * 启动
   */
  async start({ name, branch }) {
    const paths = await projectHelper.findGitProjects(cwd)
    consoleColor.start(`共计${paths.length}个工程`) 
    let count = 0
    for (let path of paths) {
      count++
      consoleColor.start(`当前[${count}] @ ${path},剩余${paths.length - count}个工程`)
      try {
        const cmdStr = `git remote update`
        consoleColor.start(cmdStr)
        consoleColor.start(`${cmdStr} @ ${path}`)
        await exec(cmdStr, { cwd: path })
      }
      catch (e) {
      }

      try {
        const cmdStr = `git checkout ${branch ? '-b' : ''} ${name}`
        consoleColor.start(cmdStr)
        consoleColor.start(`checkout @ ${path}`)
        await exec(cmdStr, { cwd: path })
      }
      catch (e) {
        consoleColor.red(`发生异常:${e.message}`, false)
      }

    }


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
