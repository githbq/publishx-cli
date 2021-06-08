
import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
import show from './show'
import * as Listr from 'listr' 
/**
 * 配置或者查看yarn registry
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    // registry 任务
    const registryStr = `yarn config set registry https://registry.npm.taobao.org`
    const npmRegistryStr = `yarn config set registry https://registry.npmjs.org`
    const kRegistryStr = `yarn config set registry http://npm.corp.kuaishou.com`
    await this.showCurrentRegistry()
    if (data.taobao) {
      consoleColor.start(`${registryStr}`)
      await exec(registryStr)
    } else if (data.npm) {
      consoleColor.start(`${npmRegistryStr}`)
      await exec(npmRegistryStr)
    }
    else if (data.ks) {
      consoleColor.start(`${kRegistryStr}`)
      await exec(kRegistryStr)
    }
    if (data.taobao || data.npm || data.ks) {
      await this.showCurrentRegistry()
    }

    // ------------------------install 任务------------------------
    if (data.install) { 
      /**
       * 查找所有git项目
       */
      const pathModels = await show.findProjectPaths()
      const tasks = []

      for (let pathModel of pathModels) {
        tasks.push({
          title: `执行 yarn install @ ${pathModel.path}`,
          task: () => {
            return exec('yarn install ', { cwd: pathModel.path, preventDefault: true }).catch(() => { })
          }
        })
      }
      const taskManager = new Listr(tasks, { concurrent: 5 })
      await taskManager.run() 
      consoleColor.green('yarn install 完毕\n\n', true)
    }
    //-------------------------------------------------------

    consoleColor.green(`操作结束！`)
  },
  async showCurrentRegistry() {
    consoleColor.green('当前 yarn registry地址:')
    await exec('yarn config get registry')
  },
  command: [
    '配置或者查看 yarn registry',
    {
      install: {
        alias: ['i'],
        boolean: true,
        describe: '对找出来的项目执行 yarn install '
      },
      taobao: {
        alias: ['t'],
        boolean: true,
        describe: '将 yarn 默认 registry 设置为https://registry.npm.taobao.org'
      },
      npm: {
        alias: ['n'],
        boolean: true,
        describe: '将 yarn 默认 registry 设置为https://registry.npmjs.org'
      },
      ks: {
        alias: ['k'],
        boolean: true,
        describe: '将 yarn 默认 registry 设置为 http://npm.corp.kuaishou.com'
      } 
    },

  ]
}
