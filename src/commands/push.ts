import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 推送远程服务器对应分支的代码
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const currentBranchName = await getCurrentBranchName()//当前项目分支名
        data.branch = data.branch || currentBranchName
        data.origin = data.origin || 'origin'
        const cmdStr = `git push ${data.origin} ${data.branch} ${data.force ? '--force' : ''}`
        consoleColor.start(cmdStr) 
        try {
            await exec(cmdStr)
        } catch (e) {
        } 
    }, command: [
        'git push [origin] <current branch>', {
            origin: {
                alias: ['o'],
                string: true,
                describe: '对应远程的名称 默认为origin'
            },
            force: {
                alias: ['f'],
                boolean: true,
                describe: '是否强推 --force'
            }
        }]
}