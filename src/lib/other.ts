import * as  stringifyOrigin from 'json-stringify-pretty-compact'
import * as Bluebird from 'bluebird'
import * as lodash from 'lodash'
import * as pathTool from 'path'
import spawn from 'spawn-helper'
import * as  prettyMsOrigin from 'pretty-ms'
import { prompt as promptOrigin } from 'inquirer'
import { rootPath, cwd } from './consts'
import { consoleColor } from './consoleColor'

export const _Promise = Bluebird
/**lodash */
export const _ = lodash
/**
 * json美化
 */
export function stringify(obj, options = {}): string {
  return stringifyOrigin(obj, { maxLength: 50, indent: 4, ...options })
}
/**
 * 读取用户输入
 */
export async function prompt(message, defaultValue?) {
  let { input } = await promptOrigin([{ name: 'input', message, default: defaultValue }])
  return _.trim(input)
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
  return spawn.exec(cmd, {
    cwd,
    onStdout(msg) {
    },
    onStderr(msg) {
    }, preventDefault: false, ...opt
  })
}
/**
 * 美化时间毫秒输出
 */
export function prettyMs(ms: number) {
  return prettyMsOrigin(ms, { verbose: true })
}
export interface Task {
  action(...params: any[]): any
  name: string

}

export async function runTasks(tasks: Array<Task>, params: any) {
  if (!tasks) {
    return
  }
  consoleColor.time('总耗时')
  for (let task of tasks) {
    consoleColor.time(`任务:${task.name} 耗时`)
    const result = await task.action(params)
    consoleColor.timeEnd(`任务:${task.name} 耗时`)
    if (result === false) {
      consoleColor.red(`任务失败${task.name}，执行终止`)
      break
    }
  }
  consoleColor.timeEnd('总耗时')
}


