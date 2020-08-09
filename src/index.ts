import * as requireDir from 'require-dir'
import * as  yargs from 'yargs'
import { exit, consoleColor } from './lib'
import * as  momentHelper from 'moment-helper'
export function start() {
  const commands = requireDir('./commands', { recurse: true })

  consoleColor.yellow(' 操作时间：' + momentHelper.get() + '\n')
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
        try {
          consoleColor.time(`${key} 总耗时`)
          await result.start(argv)
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
  if (!argv._.length) {
    yargs.showHelp()
  }
  return { argv, yargs }
}

start()
