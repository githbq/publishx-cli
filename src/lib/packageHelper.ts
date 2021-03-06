import * as semver from 'semver'
import * as pathTool from 'path'
import { rootPath } from './consts'
import { io } from './io'
export const packageHelper = {
    cwd: null,
    getProjectName(_cwd?: string) {
        return (_cwd || this.cwd || rootPath).split(/[/\\]/).pop()
    },
    getPath(_cwd?: string) {
        return pathTool.join(_cwd || this.cwd || rootPath, 'package.json')
    },
    async get(_cwd?: string) {
        const packagePath = this.getPath(_cwd)
        if (await io.exists(packagePath)) {
            return require(packagePath)
        } else {
            return { name: 'demo1', scripts: {} }
        }
    },
    getSync(_cwd?: string) {
        const packagePath = this.getPath(_cwd)
        if (io.existsSync(packagePath)) {
            return require(packagePath)
        } else {
            return { name: 'demo1', scripts: {} }
        }
    },
    write(jsonObj: object, _cwd?: string) {
        return io.write(this.getPath(_cwd), jsonObj)
    },
    //获取version
    async getVersion(currentVersion?, _cwd?: string) {  
        let version = currentVersion || (await this.get(_cwd || rootPath)).version 
        if (!semver.valid(version)) {
            throw new Error('Invalid version number found in package.json, please make sure it is valid')
        }
        return [semver.major(version), semver.minor(version), semver.patch(version)].join('.')
    },
}