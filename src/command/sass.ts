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

    consoleColor.time('总耗时')
    try {
      await exec(npmCmdStr)
    } catch (e) {
      consoleColor.error(e)
    }
    try {
      await exec(yarnCmdStr)
    } catch (e) {
      consoleColor.error(e)
    }
    consoleColor.timeEnd('总耗时')
  },
  command: [
    'sass',
    '操作系统设置 git config set sass-binary-site 为 taobaonpm 解决node-sass安装缓慢问题',
    {
    }
  ]
}
