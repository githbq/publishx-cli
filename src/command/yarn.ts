
import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
/**
 * 配置或者查看yarn registry
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const registryStr = `yarn config set registry https://registry.npm.taobao.org`
    const npmRegistryStr = `yarn config set registry https://registry.npmjs.org`
    const zhaopinRegistryStr = `yarn config set registry http://npm.zhaopin.com`
    await this.showCurrentRegistry()
    if (data.taobao) {
      consoleColor.start(`${registryStr}`)
      await exec(registryStr)
    } else if (data.npm) {
      consoleColor.start(`${npmRegistryStr}`)
      await exec(npmRegistryStr)
    }
    else if (data.zhaopin) {
      consoleColor.start(`${zhaopinRegistryStr}`)
      await exec(zhaopinRegistryStr)
    }
    if (data.taobao || data.npm || data.zhaopin) {
      await this.showCurrentRegistry()
    }
    consoleColor.green(`操作结束！`)
  },
  async showCurrentRegistry() {
    consoleColor.green('当前 yarn registry地址:')
    await exec('yarn config get registry')
  },
  command: [
    'yarn',
    '配置或者查看 yarn registry',
    {
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
      zhaopin: {
        alias: ['z'],
        boolean: true,
        describe: '将 yarn 默认 registry 设置为http://npm.zhaopin.com'
      }
    },

  ]
}
