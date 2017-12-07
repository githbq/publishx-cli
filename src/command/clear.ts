import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 删除 node_modules
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const pattern = '**/node_modules'
    const cmdStr = `rimraf **/node_modules`
    consoleColor.start(cmdStr)
    consoleColor.time('耗时')
    try {
      await io.rimraf(pattern)
    }
    catch (e) {
      consoleColor.red(`发生异常:${e.message}`, false)
    }
    consoleColor.timeEnd('耗时')
  },
  command: [
    'clear', 'rimraf **/node_modules',
    {
    }
  ]
}
