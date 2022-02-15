// npm config set sass-binary-path D:/node-binaries/node-sass-win32-x64-57_binding.node

// yarn config set sass-binary-path D:/node-binaries/node-sass-win32-x64-57_binding.node
//https://npm.taobao.org/mirrors/node-sass/v4.5.3/win32-x64-57_binding.node


import { _, exec, getCurrentBranchName, cwd, consoleColor, io, checkOS } from '../lib'
/**
 * 配置sass
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const cmdStrs = [
            'git config --global --unset http.proxy',
            'git config --global --unset https.proxy',
            'git config --global --add remote.origin.proxy ""',
            'git config --global --unset-all remote.origin.proxy',
            'git config --global http.sslVerify false'
        ] 
        consoleColor.yellow(`
git config --global http.proxy 127.0.0.1:7890
git config --global https.proxy 127.0.0.1:7890 

查看代理
git config --global https.proxy

npm config delete proxy
        `)
        for (let cmdStr of cmdStrs) {
            try {
                consoleColor.start(cmdStr)
                await exec(cmdStr)
            } catch (e) {
                consoleColor.error(e)
            }
        } 
    },
    command: [ 
        `fatal: unable to access 'https://github.com/xxxxx.git/': Failed to connect to github.com port 443: Operation timed out`,
        {

        }
    ]
}
