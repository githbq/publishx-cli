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
        const binarySite = `http://npm.taobao.org/mirrors${data.package}`
        const npmCmdStr = `npm config set ${data.package}-binary-site ${binarySite}`
        const yarnCmdStr = `yarn config set ${data.package}-binary-site ${binarySite}`

        try {
            consoleColor.start(npmCmdStr)
            await exec(npmCmdStr)
        } catch (e) {
            consoleColor.error(e)
        }
        try {
            consoleColor.start(yarnCmdStr)
            await exec(yarnCmdStr)
        } catch (e) {
        }
    },
    command: [
        '<package>',
        '操作系统设置 npm|yarn config set xxx-binary-site 为 taobaonpm 解决 xxx 安装缓慢问题',
        {

        }
    ]
}
