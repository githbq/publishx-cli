import * as pathTool from 'path'
import * as fs from 'fs-extra-promise'
import { rootPath, cwd } from './consts'
import { stringify } from './other'
import * as _ from 'lodash'
import * as globby from 'globby'
export const io = {
  pathTool,
  resolveOptions(path: string, options: any = { fromRoot: false, fromCwd: false }) {
    path = pathTool.join.apply(null, [].concat(path))
    path = pathTool.join.apply(null, (options.fromRoot ? [rootPath] : options.fromCwd ? [cwd] : []).concat(path))//考虑多路径处理
    return path
  },
  globby(patterns: string | Array<string>, options: any = {}) { return globby(patterns, { dot: true, silent: true, strict: false, ...options }) },
  read(path: string, options: any = { fromRoot: false, fromCwd: false }) {
    path = this.resolveOptions(path, options)
    return fs.readFileAsync(path, 'utf8')
  },
  write(path: string, content, options: any = { fromRoot: false, fromCwd: false }) {
    path = this.resolveOptions(path, options)
    //对对象进行 美化格式处理
    content = _.isObject(content) ? stringify(content) : content
    return fs.outputFileAsync(path, content)
  },
  delete(path) {
    path = pathTool.join.apply(null, [].concat(path))
    return fs.removeAsync(path)
  },
  exists(path, options: any = { fromRoot: false, fromCwd: false }) {
    path = this.resolveOptions(path, options)
    return fs.existsAsync(path)
  },
  /**
   * 将文件或者路径 复制到另一个目录
   */
  copy(from: string, to: string) {
    return fs.copyAsync(from, to)
  },
  /**
   * 统一将路径分割符换成 /
   */
  replaceSep(path: string) {
    return path.replace(/\\/g, '/')
  },
  /**
   * 判断第一个参数是否是第二个参数的父路径   parent:  /t/c  child /t/c/d
   */
  isSubDir(parent: string | Array<string>, child: string | Array<string>) {
    let parentPath: string = pathTool.resolve.apply(null, [].concat(parent))
    parentPath = this.replaceSep(parentPath)
    let childPath: string = pathTool.resolve.apply(null, [].concat(child))
    childPath = this.replaceSep(childPath)
    return childPath.startsWith(parentPath) && childPath.lastIndexOf('/') > parentPath.lastIndexOf('/')
  }
}
