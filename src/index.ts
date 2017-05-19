import * as requireDir from 'require-dir'
import * as  yargs from 'yargs'
import { exit, consoleColor } from './lib'
export function start() {
    const commands = requireDir('./command')
    Object.keys(commands).forEach(key => {
        const result = commands[key].default
        if (result && !(/^(common|index|_)/.test(key)) && result.start) {
            yargs.command.apply(null, result.command.slice(0, 3).concat(async (argv) => {
                try {
                    await result.start(argv)
                } catch (e) {
                    consoleColor.red(`发生错误${e.message}`)
                    consoleColor.red(e.stack)
                }
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