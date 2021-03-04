
import * as pathTool from 'path'
export const cwd = process.cwd().replace(/\\/g, '/')
export const rootPath = pathTool.join(__dirname, '..', '..')

export const ignorePattern = '!**/{__test__,__mocks__,node_modules,types,example,examples,build,temp,template,templates,dist}/**'