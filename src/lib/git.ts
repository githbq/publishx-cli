import spawn from 'spawn-helper'
export function getCurrentBranchName(opts = {}) {
    return spawn.exec('git symbolic-ref --short -q HEAD', { preventDefault: true, ...opts }).then((a, b) => {
        return a.stdout.replace(/[\n]/g, '')
    })
}    