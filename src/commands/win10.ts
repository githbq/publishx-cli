import { overSome } from 'lodash'
import { _, checkOS, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 拉取远程服务器对应分支的代码
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        if (checkOS.windows) {
            // px : 无法加载文件 C:\Users\vhouyuewei\AppData\Roaming\npm\px.ps1，
            const cmdStr = `set-ExecutionPolicy RemoteSigned`
            consoleColor.start(cmdStr)
            try {
                await exec(cmdStr, { stdio: 'inherit' })
            } catch (e) {
            }
        }
    },
    command: [
    ]
}