import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'

/**
 * 环境初始化
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const helpStr = `
    1. 将npm升级到最新版: npm i -g npm
    2. 安装全局跨平台删除命令rimraf: npm i -g rimraf
    3. 安装全局命令 yarn: npm i -g yarn
    4. 安装 iclone-cli 脚手架工具: npm i -g iclone-cli
    5. 将 yarn registry切换到淘宝npm:     px yarn -t
    6. 安装全局命令 cnpm: npm i -g cnpm
    7. 初始化 git 默认行为:px git init
         `
    console.log('帮助信息:\n', helpStr)
    const cmdData = [
      {
        desc: '将npm升级到最新版',
        cmdStr: `npm i -g npm`
      },
      {
        desc: '安装全局跨平台删除命令 rimraf ',
        cmdStr: `npm i -g rimraf`
      },
      {
        desc: `安装全局命令 yarn`,
        cmdStr: `npm i -g yarn`
      },
      {
        desc: '安装 iclone-cli 脚手架工具',
        cmdStr: `npm i -g iclone-cli`
      },
      {
        desc: `将 yarn 命令 registry 切换到 https://registry.taobao.npm.org`,
        cmdStr: `px yarn -t`
      },
      {
        desc: `安装全局命令 cnpm`,
        cmdStr: `npm i -g cnpm`
      },
      {
        desc: `初始化 git 默认行为`,
        cmdStr: `px git init`
      },
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
    '新电脑环境初始化,安装常用全局命令,与基本配置',
    {
    }
  ]
}
