
import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
/**
 * n
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const cmds = [
            `N_NODE_MIRROR=https://npm.taobao.org/mirrors/node n ${data.version || 'latest'}`
        ]
        for (let cmdStr of cmds) {
            consoleColor.start(cmdStr)
            await exec(cmdStr)
        }
    },
    command: [
        '<version>',
        'n install with taobao registry',
        {
        }
    ]
}
