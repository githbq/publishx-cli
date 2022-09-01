import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 重置当前分支到对应的远程分支版本
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const currentBranchName = await getCurrentBranchName()//当前项目分支名
        data.branch = data.branch || currentBranchName
        data.origin = data.origin || 'origin'
        const cmdStr = `git reset --hard origin/${data.branch}`
        consoleColor.start(cmdStr)
        try {
            await exec(cmdStr)
        } catch (e) {
            consoleColor.error(e)
        }
    },
    command: [
        'git reset --hard origin/<current-branch>'
    ]
}