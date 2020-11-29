import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 删除 node_modules
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    if (data.tagNames) { 
      const tags = data.tagNames.split(',').filter(n => !!n)
      const cmdStrs = tags.map(n => {
        return `git tag --delete ${n} && git push origin :refs/tags/${n}`
      })
      for (let cmdStr of cmdStrs) {
        consoleColor.start(cmdStr)
        try {
          await exec(cmdStr)
        } catch (error) {
          consoleColor.error(error)
        }
      } 
    }
  },
  command: [
    '<tagNames>', '多个tag以,分割  git tag --delete [tagName] && git push origin :refs/tags/[tagName]',
    {
    }
  ]
}
