import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 拉取远程服务器对应分支的代码
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const currentBranchName = await getCurrentBranchName()//当前项目分支名
        data.branch = data.branch || currentBranchName
        data.origin = data.origin || 'origin'
        const cmdStr = `git pull ${data.origin} ${data.branch}`
        consoleColor.start(cmdStr) 
        try {
            await exec(cmdStr)
        } catch (e) {
        } 
    },
    command: [
        'git pull [origin] <current branch>', {
            branch: {
                alias: ['b'],
                string: true,
                describe: '分支名 不填则取当前分支'
            },
            origin: {
                alias: ['o'],
                string: true,
                describe: '对应远程的名称 默认为origin'
            },
        }
    ]
}