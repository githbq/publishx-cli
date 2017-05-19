
import * as pathTool from 'path'
export const cwd = process.cwd().replace(/\\/g, '/')
export const rootPath = pathTool.join(__dirname, '..', '..')