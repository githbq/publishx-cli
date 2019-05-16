import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 删除 node_modules
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const patternString = '**/node_modules **/package-lock.json **/yarn.lock'
    const patterns = patternString.split(' ')

    consoleColor.start('rimraf ' + patternString) 
    consoleColor.time('耗时')
    for (let pattern of patterns) {
      const cmdStr = `rimraf ${pattern}`
     
      try {
        await io.rimraf(pattern)
      }
      catch (e) {
        consoleColor.red(`发生异常:${e.message}`, false)
      } 
    }
    consoleColor.timeEnd('耗时')
  },
  command: [
    'clear', 'rimraf **/node_modules',
    {
    }
  ]
}
