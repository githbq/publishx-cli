import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'
import { kill, killer } from 'cross-port-killer'
/**
 * 忽略node_modules与.git对当前工程压缩成一个zip包放置在dist文件夹下
 */
export default {
    /**
     * 启动
     */
    async start({ port }) {
        if (!port) {
            return
        }
        consoleColor.start(`开始杀网络端口 ${port}`)
        const pids = await kill(port)
        consoleColor.green(`杀掉了网络端口 ${port} 对应 pids = ${JSON.stringify(pids)}`)
    },
    command: [
        '<port>',
        '跨平台杀端口',
        {

        }
    ]
}
