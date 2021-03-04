import * as pathTool from 'path'
import * as globby from 'globby'
import * as fs from 'fs-extra' 
import { ignorePattern } from './consts'


export const projectHelper = {
    isGitProject: async (path) => {
        return fs.pathExists(pathTool.join(path, '.git'))
    },
    isNodeProject: async (path) => {
        return fs.pathExists(pathTool.join(path, 'package.json'))
    },
    findGitProjects: async (cwd, patterns = [], globOptions = {}) => {
        let paths = await globby(['**/.git/', ignorePattern, ...[].concat(patterns)], { dot: false, onlyDirectories: true, cwd, ...globOptions })
        paths = paths.map(path => pathTool.dirname(path))
        return paths
    },
    findNodeProjects: async (cwd, patterns = [], globOptions = {}) => {
        let paths = await globby(['**/package.json', ignorePattern, ...[].concat(patterns)], { dot: false, onlyDirectories: true, cwd, ...globOptions })
        paths = paths.map(path => pathTool.dirname(path))
        return paths
    }
}
