import * as fse from 'fs-extra'
import { _, exec, cwd, consoleColor, io } from '../lib'




/**
 * git初始化
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const helpStr = `  
        mac 初始化时需要配置 zsh 配置默认终端、设置别名等，
        为了简化一系列操作用拿命令行的方式自动完成所有操作
         `
    console.log('帮助信息:\n', helpStr)
    const cmdData = [
      {
        desc: '设置默认终端环境为 zsh',
        cmdStr: `chsh -s /bin/zsh`
      },
      // {
      //   desc: `安装 oh-my-zsh`,
      //   cmdStr: `sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`
      // },

      {
        desc: `设置 wksp 与 gwskp 别名`,
        async execute() {
          const workspacePath = io.pathTool.resolve('~/Documents/workspace')
          const gworkspacePath = io.pathTool.resolve('~/Documents/github-workspace')
          const zshConfigPath = io.pathTool.resolve('~/.zshrc')
          // 检查 ~/Documents/workspace 与 ~/Documents/github-workspace 目录存在，不存在则创建目录
          await Promise.all([
            fse.ensureDir(workspacePath),
            fse.ensureDir(gworkspacePath),
            fse.ensureFile(zshConfigPath)
          ])
          let zshConfig = await fse.readFile(zshConfigPath).toString()
          if (zshConfig.indexOf('github-workspace1') === -1) {
            zshConfig += `
# my alias
alias wksp="cd ~/Documents/workspace"
alias gwksp="cd ~/Documents/github-workspace"

            `
          }
          await fse.outputFile(zshConfigPath, zshConfig)
          const ensureZshConfigCmdStr = 'source ~/.zshrc'
          consoleColor.start(ensureZshConfigCmdStr)
          await exec(ensureZshConfigCmdStr, { cwd })
          consoleColor.green('执行完毕', true)
          // 在 ~/.zshrc 文件中添加别名配置
          // 生效配置 
        }
      }
    ]
    for (let data of cmdData) {
      consoleColor.green(data.desc)
      try {
        if (data.cmdStr) {
          consoleColor.start(data.cmdStr)
          //执行任务
          await exec(data.cmdStr, { cwd })
        } else if (data.execute) {
          await data.execute()
        }
        consoleColor.green('执行完毕', true)
      } catch (e) {
        consoleColor.error(e)
      }

    }
    consoleColor.green(`操作结束！`)
  },
  command: [
    'zsh',
    '初始化 zsh ,设置默认终端、安装 oh-my-zsh、配置别名',
    {
    }
  ]
}






