import { _, runTasks, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 智能clone git项目，自动装库 自动打开vscode
 */
export default {
  /**
   * 启动
   */
  async start(params) {
    params.name = params.name || ''
    params.branch = params.branch || 'master'
    params.projectName = params.name ? params.name : params.url.replace(/(.*\/|\.git$)/g, '')
    await runTasks(this.tasks, params)
  },
  tasks: [
    {
      name: 'clone',
      action: async ({ branch, name, url }) => {
        consoleColor.green('提示: 默认参数 --recursive 自动clone对应的子模块 git submodule')
        // --depth=1 会导致无法切换分支  暂时不加
        const cmdStr = `git clone ${url} -b ${branch} ${name} --recursive`
        consoleColor.start(cmdStr)
        try {
          await exec(cmdStr)
        } catch (e) {
          return false
        }
      }
    },
    {
      name: 'code',
      action: async ({ name, url, projectName }) => {
        consoleColor.green('提示: 尝试用vscode打开项目')
        const cmdStr = `code ${projectName}`
        consoleColor.start(cmdStr)
        try {
          await exec(cmdStr)
        } catch (e) {
          consoleColor.yellow('你还没有安装 vscode 或者 没有将 code 命令注册到环境变量中')
        }
      }
    },
    {
      name: 'yarn',
      action: async ({ name, url, projectName }) => {
        consoleColor.green('提示: 默认对clone下的项目进行yarn装库操作')
        const cmdStr = `yarn`
        consoleColor.start(cmdStr)
        try {
          await exec(cmdStr, { cwd: io.pathTool.join(cwd, projectName) })
        } catch (e) {
        }
      }
    }
  ]
  ,
  command: ['clone <url>', '智能clone git项目，自动装库 自动打开vscode,git clone --branch? [branch] [name]? ',
    {
      branch: {
        alias: 'b',
        describe: '指定分支名',
        string: true,
        default: 'master'
      },
      name: {
        alias: 'n',
        describe: '重定义项目文件夹名称',
        string: true,
        default: ''
      }
    }
  ]
}
