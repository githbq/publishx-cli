
import { checkOS, ignorePattern, exec, consoleColor, cwd, io } from '../lib'
/**
 * 删除 node_modules
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const filePaths = await io.globby(['**/*.pem', ignorePattern], { absolute: true, cwd })

        const isWindow = checkOS.windows

        const getCmdStr = (filePath) => {
            let result = `chmod 600 ${filePath}`
            if (isWindow) {
                result = `  
        cmd /c icacls "${filePath}" /c /t /inheritance:d
        cmd /c icacls "${filePath}" /c /t /grant %username%:F
        cmd /c icacls "${filePath}" /c /t /remove Administrator "Authenticated Users" BUILTIN\\Administrators BUILTIN Everyone System Users
        cmd /c icacls "${filePath}"
        `
            }
            return result
        }

        for (let filePath of filePaths) {

            const cmdStr = getCmdStr(filePath)
            consoleColor.start(`开始：${filePath}`)
            try {
                exec(cmdStr, { stdio: 'inherit' })
            } catch (e) {
                consoleColor.red(`文件：${filePath}降权异常`)
                consoleColor.error(e)
            }
            consoleColor.yellow(`文件：${filePath} 降权完成`)
        }
    },
    command: [
        '对pem文件降权以通过ssh方式登录',
        {
        }
    ]
}
