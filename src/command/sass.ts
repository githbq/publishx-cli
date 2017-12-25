// npm config set sass-binary-path D:/node-binaries/node-sass-win32-x64-48_binding.node

// yarn config set sass-binary-path D:/node-binaries/node-sass-win32-x64-48_binding.node
//https://npm.taobao.org/mirrors/node-sass/v4.5.3/win32-x64-48_binding.node


import { _, exec, getCurrentBranchName, cwd, consoleColor, io, checkOS } from '../lib'
import * as download from 'download'
/**
 * 配置sass
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    if (!checkOS.windows) {
      consoleColor.yellow(`这个命令目前仅针支持windows操作系统`, false)
      return
    }
    const version = (data.version || '4.5.3').replace(/^v/i, '')
    const dist = `${checkOS.windows ? 'C:' : '~'}/node-binaries`
    const filename = `node-sass-${version}-win32-x64-48_binding.node`
    const npmCmdStr = `npm config set sass-binary-path ${dist}/${filename}`
    const yarnCmdStr = `yarn config set sass-binary-path ${dist}/${filename}`

    const downloadUrl = `https://npm.taobao.org/mirrors/node-sass/v${version}/win32-x64-48_binding.node`

    consoleColor.time('总耗时')
    try {
      consoleColor.green(`正在下载 node-sass 包,从:` + downloadUrl)
      await download(downloadUrl, dist, { filename })
      consoleColor.green(`下载完毕`, true)
      consoleColor.start(npmCmdStr)
      await exec(npmCmdStr)
      consoleColor.green(`操作完毕`, true)
      try {
        consoleColor.start(yarnCmdStr)
        consoleColor.green(`操作完毕`, true)
      } catch (ex) {
        consoleColor.yellow('本地未安装 yarn 跳过这一步')
      }
      await exec(yarnCmdStr)
      consoleColor.green('全部操作完毕,之后在windows系统上 安装node-sass时会快很多', true)
    } catch (e) {
      consoleColor.error(e)
    }
    consoleColor.timeEnd('总耗时')
  },
  command: [
    'sass',
    'windows操作系统设置sass binary本地路径 解决node-sass安装缓慢问题',
    {
      version: {
        alias: ['v'],
        string: true,
        describe: 'node-sass的版本,默认为 4.5.3'
      },
    }
  ]
}
