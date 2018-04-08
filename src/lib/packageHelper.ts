import * as semver from 'semver'
import * as pathTool from 'path'
import { cwd } from './consts'
import { io } from './io'
export const packageHelper = {
    cwd: null,
    getPath(_cwd?: string) {
        return pathTool.join(_cwd || this.cwd || cwd, 'package.json')
    },
    get(_cwd?: string) {
        if (io.exists(this.getPath(_cwd))) {
            return require(this.getPath(_cwd))
        } else {
            return { scripts: {} }
        }
    },
    write(jsonObj: object, _cwd?: string) {
        return io.write(this.getPath(_cwd), jsonObj)
    },
    //获取version
    getVersion(currentVersion?, _cwd?: string) {
        let version = currentVersion || this.get(_cwd).version
        if (!semver.valid(version)) {
            throw new Error('Invalid version number found in package.json, please make sure it is valid')
        }
        return [semver.major(version), semver.minor(version), semver.patch(version)].join('.')
    },
}