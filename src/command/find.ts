import { io, cwd, consoleColor } from '../lib'

/**
 * 拉取远程服务器对应分支的代码
 */
export default {
  /**
   * 启动
   */
  async start({ patterns }) {
    if (patterns) { 
      const patternList = patterns.split(',').filter(n => !!n) 
      const paths = await io.globby([...patternList, '!**/node_modules/**/*'], { dot: true, cwd, nodir: true, absolute: false })

      paths.forEach(p => {
        consoleColor.green(p + '\n')
      })
      consoleColor.yellow(`共找到${paths.length}个文件。`)
    }
  }, command: ['find <patterns>', 'glob patterns', {

  }]
}