


import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
import show from './show'
import * as Listr from 'listr'
import { Observable } from 'rxjs'

/**
 * go
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const helpStr = `  
        # 配置 GOPROXY 环境变量
        export GOPROXY=https://goproxy.io,direct
        # 还可以设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）
        export GOPRIVATE=git.mycompany.com,github.com/my/private
         `
        console.log('帮助信息:\n', helpStr)
        const cmdData = [ 
        ]
        for (let data of cmdData) {
            consoleColor.green(data.desc)
            consoleColor.start(data.cmdStr)
            try {
                //执行任务
                await exec(data.cmdStr, { cwd })
                consoleColor.green('执行完毕', true)
            } catch (e) {
                consoleColor.error(e)
            }
        }
        consoleColor.green(`操作结束！`)
    },
    command: [ 
        '初始化go',
        {
        }
    ]
}