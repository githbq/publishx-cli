import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
import show from './show'
import * as Listr from 'listr'
import { Observable } from 'rxjs'

/**
 * git初始化
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const helpStr = `  
         git config --global user.name "Your Name"
         git config --global user.email "email@example.com" 
         //使用淘宝npm
         npm config set registry http://registry.npm.taobao.org
         ssh-keygen -t rsa -C “xxx@yyy.com”
         `
        console.log('帮助信息:\n', helpStr)
        const cmdData = [
            {
                desc: 'git config --global --unset https.proxy',
                cmdStr: 'git config --global --unset https.proxy',
            },
            {
                desc: 'git config --global --unset http.proxy',
                cmdStr: 'git config --global --unset http.proxy',
            },
            // {
            //     desc: `git config --global http.sslVerify "false"`,
            //     cmdStr: 'git config --global http.sslVerify "false"'
            // },
            // {
            //     desc: `git config --global http.sslVerify "false"`,
            //     cmdStr: 'git config --global http.sslVerify "false"'
            // },
            {
                desc: 'git敏感大小写  默认是忽略大小写的 会不认识文件名的大小写 所以需要设为false',
                cmdStr: `git config core.ignorecase false`
            },
            {
                desc: `git 自动记住账号密码`,
                cmdStr: `git config --global credential.helper store`
            },

            {
                desc: `git push origin 仅推送当前分支 如果  最后一位是 matching 而不是simple 则会推送所有本地分支`,
                cmdStr: `git config --global push.default simple`
            },
            {
                desc: `windows中的换行符为 CRLF， 而在linux下的换行符为LF，所以在执行add . 时出现提示，解决办法,禁用自动转换`,
                cmdStr: `git config --global core.autocrlf false`
            }
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
        'init',
        '初始化git，区分大写小以及自动保存用户名 ...',
        {
        }
    ]
}