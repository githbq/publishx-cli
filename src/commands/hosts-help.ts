import { _, requireCwd, exec, getCurrentBranchName, cwd, consoleColor, io, packageHelper, checkOS } from '../lib'
import { Observable } from 'rxjs'
import * as  delay from 'delay'
import * as Listr from 'listr'
/**
 * win10 hosts 配权限
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        if (checkOS.windows) {
            const cmdStr = `explorer.exe "C:\\Windows\\System32\\drivers\\etc"`
            consoleColor.start(cmdStr) 
            consoleColor.green(`window系统hosts配置文件地址为 C:\\Windows\\System32\\drivers\\etc\\hosts`)
            try {
                await exec(cmdStr)
            }
            catch (e) { 
            }
            consoleColor.green(`
            1. 右击hosts文件选择属性，然后点击安全Tab页，查看当前登录用户的权限，显示当前登录用户无hosts文件的写入权限。
            2. 选中当前登录用户，在安全Tab点击编辑按钮，修改当前登录用户对hosts文件的操作权限，勾选写入权限，然后点击确认。
            3. 现在你可以愉快的使用switchhosts修改hosts而不会有权限提示了。
            `)

        } else {
            consoleColor.green(`
            linux || unix 内核系统的hosts配置文件地址为 /etc/hosts
            请使用管理员模权限进行修改 
            $  sudo vim /etc/hosts
            `)
        }
    },
    command: [
        'win10系统配置hosts权限快捷打开hosts文件所在目录并提示后续操作步骤',
        {
        }
    ]
}