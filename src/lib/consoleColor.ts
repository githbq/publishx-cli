import * as color from 'cli-color'
import * as ora from 'ora'

import { prettyMs } from './other'

export const consoleColor = {
    ok: ' √ ',
    no: ' × ',
    color(colorAction, msg, ok = null, bold: boolean = false) {
        let prefix = ok === null ? '' : ok === false ? this.no : this.ok
        console.log(colorAction(`\n${prefix}${msg} `))
    },
    green(msg, ok?: boolean, bold: boolean = false) {
        this.color(color.green, msg, ok, bold)
    },
    yellow(msg, ok?: boolean, bold: boolean = false) {
        this.color(bold ? color.yellowBright : color.yellow, msg, ok, bold, bold)
    },
    red(msg, ok?: boolean, bold: boolean = false) {

        this.color(bold ? color.redBright : color.red, msg, ok, bold)
    },
    white(msg, ok?: boolean, bold: boolean = false) {

        this.color(bold ? color.whiteBright : color.white, msg, ok, bold)
    },
    blue(msg, ok?: boolean, bold: boolean = false) {

        this.color(bold ? color.blueBright : color.blue, msg, ok, bold)
    },
    error(e: Error) {
        this.red(e.message)
    },
    start(msg) {
        this.green(`$> 开始:${color.blueBright.bgWhite(msg)}`)
    },
    any(fn) {
        // color.blue.bgWhite(`✅`)
        fn && console.log(fn.call(this, color))
    },
    timeCache: {},
    time(key: string) {
        this.timeCache[key] = new Date().getTime()
    },
    timeEnd(key: string) {
        let now: number = new Date().getTime()
        let startTime: number = this.timeCache[key]
        if (startTime) {
            this.green(`${key}:${prettyMs(now - startTime)}`)
        }
    },
    /**
     * 控制台显示旋转动画  返回 spinner 对象 api查看 ora库
     */
    showSpiner(msg: string | object) {
        const spinner = ora(msg).start()
        return {
            ok: spinner.succeed.bind(spinner),
            error: spinner.fail.bind(spinner),
            warn: spinner.warn.bind(spinner),
            info: spinner.info.bind(spinner),
            keep: spinner.stopAndPersist.bind(spinner),
            self: spinner
        }
    }
}
