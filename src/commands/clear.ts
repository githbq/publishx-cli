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
    for (let pattern of patterns) {
      if (pattern) {

        try {
          await io.rimraf(pattern)
        }
        catch (e) {
          consoleColor.red(`发生异常:${e.message}`, false)
        }
      }
    }
  },
  command: [
    'rimraf **/node_modules',
    {
      deleteLockFile: {
        alias: 'd',
        describe: '删除lock文件',
        boolean: true,
        default: false
      }
    }
  ]
}
