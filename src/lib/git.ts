import spawn from 'spawn-helper'
import { cwd } from './consts'
export function getCurrentBranchName(opts = {}) { 
    return spawn.exec('git symbolic-ref --short -q HEAD', { cwd, preventDefault: true, ...opts }).then((a, b) => {
        return a.stdout.replace(/[\n]/g, '')
    })
}