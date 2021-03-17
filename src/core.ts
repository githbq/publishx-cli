import * as requireDir from 'require-dir'
import * as  yargs from 'yargs'
import { exit, consoleColor, packageHelper} from './lib'
import * as  momentHelper from 'moment-helper' 
async function start(commandPath?) {
  commandPath = commandPath || './commands'
  const commands = requireDir(commandPath, { recurse: true })
  consoleColor.yellow(`~~~~~~ version@${await packageHelper.getVersion()} & time：${momentHelper.get()} ~~~~~~~\n`)
  let hit = false
  Object.keys(commands).forEach(key => {
    const result = (commands[key].index || commands[key]).default
    if (result && !(/^(common|index|_)/.test(key)) && result.start) {
      // 子命令名约定为commands下属子文件或文件夹名称
      if (result.command.length < 3) {
        // command全参数会有3个 subCommand description args，第一个代表子命令名 如 clear ,如果不需要添加动态参数如: px commit <comment>,则可以省略掉第一个参数
        // 本处理自动将第一个子命令追加到数组第一位
        result.command.unshift(key)
      } else if (result.command[0].indexOf(key) !== 0) {
        result.command[0] = `${key} ${result.command[0]}`
      }
      yargs.command.apply(null, result.command.slice(0, 3).concat(async (argv) => {
        hit = true
        try {
          consoleColor.time(`${key} 总耗时`)
          await result.start.call(result, argv)
        } catch (e) {
          consoleColor.red(`发生错误${e.message}`)
          consoleColor.red(e.stack)
        }
        consoleColor.timeEnd(`${key} 总耗时`)
        exit()
      })).help()
    }
  })
  let argv = yargs.version().argv
  if (!hit) {
    consoleColor.red('未知命令\n', false)
  }
  if (!argv._.length || !hit) {
    yargs.showHelp()
  }
  return { argv, yargs }
}

export default (commandPath) => {
  return () => {
    return start(commandPath)
  }
}
export { start }
