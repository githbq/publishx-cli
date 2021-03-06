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
    const sassBinarySite = `http://npm.taobao.org/mirrors/node-sass`
    const npmCmdStr = `npm config set sass-binary-site ${sassBinarySite}`
    const yarnCmdStr = `yarn config set sass-binary-site ${sassBinarySite}`
 
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
    '操作系统设置 npm|yarn config set sass-binary-site 为 taobaonpm 解决node-sass安装缓慢问题',
    {
    }
  ]
}
