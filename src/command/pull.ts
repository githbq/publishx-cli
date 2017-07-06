import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 推送代码到远程服务器
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const cmdStr = `git add . && git commit -am "${data.comment}"`
        consoleColor.start(cmdStr)
        consoleColor.time('耗时')
        await exec(cmdStr)
        consoleColor.timeEnd('耗时')
    }, command: ['commit <comment>', 'git add . && git commit -am [comment]', {
    }]
}