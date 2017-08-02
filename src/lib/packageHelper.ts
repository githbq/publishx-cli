import * as semver from 'semver'
import * as pathTool from 'path'
import { cwd } from './consts'
import { io } from './io'
export const packageHelper = {
    cwd: null,
    getPath() {
        return pathTool.join(this.cwd || cwd, 'package.json')
    },
    get() {
        if (io.exists(this.getPath())) {
            return require(this.getPath())
        } else {
            return { scripts: {} }
        }
    },
    write(jsonObj: object) {
        return io.write(this.getPath(), jsonObj)
    },
    //获取version
    getVersion(currentVersion?) {
        let version = currentVersion || this.get().version
        if (!semver.valid(version)) {
            throw new Error('Invalid version number found in package.json, please make sure it is valid')
        }
        return [semver.major(version), semver.minor(version), semver.patch(version)].join('.')
    },
}