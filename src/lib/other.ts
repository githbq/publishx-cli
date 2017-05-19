import * as  stringifyOrigin from 'json-stringify-pretty-compact'
import * as lodash from 'lodash'
import * as pathTool from 'path'
import spawn from 'spawn-helper'
import * as  prettyMsOrigin from 'pretty-ms'
import { rootPath, cwd } from './consts'
import { prompt as promptOrigin } from 'prompt-promise2'

export let _ = lodash
/**
 * json美化
 */
export function stringify(obj, options = {}): string {
    return stringifyOrigin(obj, { maxLength: 50, indent: 4, ...options })
}
/**
 * 读取用户输入
 */
export async function prompt(describe) {
    let value = await promptOrigin(describe)
    return _.trim(value)
}

/**
 * 从根节点引用文件
 */
export function requireRoot(...paths) {
    const path = pathTool.join.apply(null, [rootPath].concat(paths))
    return require(path)
}
/**
 * 从程序运行目录加载文件
 */
export function requireCwd(...paths) {
    const path = pathTool.join.apply(null, [cwd].concat(paths))
    return require(path)
}
/**
 * 程序终止
 */
export function exit() {
    process.exit()
}
/**
 * 确认提示
 */
export async function confirm(describe) {
    let result = await prompt(`${describe}(y/n):`)
    return result.toLowerCase().indexOf('y') !== -1
}
/**
 * 执行shell命令
 */
export function exec(cmd: string, opt?: any) {
    return spawn.exec(cmd, opt)
}
/**
 * 美化时间毫秒输出
 */
export function prettyMs(ms: number) {
    return prettyMsOrigin(ms, { verbose: true })
}



