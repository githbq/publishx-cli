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
        安装zsh: brew install zsh zsh-completions
        安装oh-my-zsh: sudo sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)" 
         `
    console.log('帮助信息:\n', helpStr)
    const cmdData = [
      {
        desc: '设置默认终端环境为 zsh',
        cmdStr: `chsh -s /bin/zsh`
      },
      {
        desc: `安装 oh-my-zsh`,
        cmdStr: `sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)" `
      },
      {
        desc: `设置 wksp 与 gwskp 别名`,
        async execute() {

          const workspacePath = io.home.resolve('~/Documents/workspace')
          const gworkspacePath = io.home.resolve('~/Documents/github-workspace')
          const zshConfigPath = io.home.resolve('~/.zshrc')
          // 检查 ~/Documents/workspace 与 ~/Documents/github-workspace 目录存在，不存在则创建目录
          await Promise.all([
            fse.ensureDir(workspacePath),
            fse.ensureDir(gworkspacePath),
            fse.ensureFile(zshConfigPath)
          ])
          let zshConfig = await (await fse.readFile(zshConfigPath)).toString()
          zshConfig += `
# start-my alias
alias wksp="cd ~/Documents/workspace"
alias gwksp="cd ~/Documents/github-workspace"
# end-my alias
            `
          await fse.outputFile(zshConfigPath, zshConfig)
          const ensureZshConfigCmdStr = `source ${zshConfigPath}`
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
      } catch (e) {
        consoleColor.error(e)
      }

    }
    consoleColor.green(`操作结束！`)
  },
  command: [
    '初始化 zsh ,设置默认终端、安装 oh-my-zsh、配置别名',
    {
    }
  ]
}






