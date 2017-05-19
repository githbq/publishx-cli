import * as pathTool from 'path'
import * as fs from 'fs-extra-promise'
import * as _ from 'lodash'

import { rootPath, cwd } from './consts'
import { stringify } from './other'
/**
 * 文件操作　全部是异步的
 */
export const io = {
    pathTool,
    /**
     * 路径预处理
     * @param path 路径　
     * @param options 参数
     */
    resolveOptions(path: string, options: any = { fromRoot: false, fromCwd: false }) {
        path = pathTool.join.apply(null, [].concat(path))
        // 考虑多路径处理
        path = pathTool.join.apply(null, (options.fromRoot ? [rootPath] : options.fromCwd ? [cwd] : []).concat(path))
        return path
    },
    read(path: string, options: any = { fromRoot: false, fromCwd: false }) {
        path = this.resolveOptions(path, options)
        return fs.readFileAsync(path, 'utf8')
    },
    readJson(path: string, options: any = { fromRoot: false, fromCwd: false }) {
        path = this.resolveOptions(path, options)
        return fs.readJsonAsync(path, 'utf8')
    },
    write(path: string, content, options: any = { fromRoot: false, fromCwd: false }) {
        path = this.resolveOptions(path, options)
        // 对对象进行 美化格式处理
        content = _.isObject(content) ? stringify(content) : content
        return fs.outputFileAsync(path, content)
    },
    delete(path, options: any = { fromRoot: false, fromCwd: false }) {
        path = this.resolveOptions(path, options)
        return fs.removeAsync(path)
    },
    exists(path, options: any = { fromRoot: false, fromCwd: false }) {
        path = this.resolveOptions(path, options)
        return fs.existsAsync(path)
    },
}