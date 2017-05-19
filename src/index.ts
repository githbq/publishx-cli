import * as requireDir from 'require-dir'
import * as  yargs from 'yargs'
import { exit } from './lib'
export function start() {
    const commands = requireDir('./command')
    Object.keys(commands).forEach(key => {
        const result = commands[key].default
        if (result && !(/^(common|index|_)/.test(key))) {
            yargs.command.apply(null, result.command.slice(0, 3).concat(async (argv) => {
                try {
                    await result.start(argv)
                } catch (e) {
                    console.error('发生错误', e.message)
                    console.error(e.stack)
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