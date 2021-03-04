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
            // 解决办法是：
            // 以管理员身份运行PowerShell
            // 执行：get-ExecutionPolicy，回复Restricted，表示状态是禁止的
            // 执行：set-ExecutionPolicy RemoteSigned
            // 选择Y
            // 注意：一定要以管理员的身份运行PowerShell，不是cmd窗口！
            const cmdStr = `set-ExecutionPolicy RemoteSigned`
            consoleColor.start(cmdStr)
            try {
                await exec(cmdStr, { stdio: 'inherit' })
            } catch (e) {
            }
        }
    },
    command: [
        'win10处理',
        {
        }
    ]
}