
import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
/**
 * 配置或者查看npm registry
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const registryStr = `npm config set registry https://registry.npm.taobao.org`
    const npmRegistryStr = `npm config set registry https://registry.npmjs.org`
    const zhaopinRegistryStr = `npm config set registry http://npm.zhaopin.com`
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
    if (data.taobao || data.npm) {
      await this.showCurrentRegistry()
    }
    consoleColor.green(`操作结束！`)
  },
  async showCurrentRegistry() {
    consoleColor.green('当前 npm registry 地址:')
    await exec('npm config get registry')
  },
  command: [
    'npm',
    '配置或者查看npm registry',
    {
      taobao: {
        alias: ['t'],
        boolean: true,
        describe: '将 npm 默认 registry 设置为https://registry.npm.taobao.org'
      },
      npm: {
        alias: ['n'],
        boolean: true,
        describe: '将 npm 默认 registry 设置为https://registry.npmjs.org'
      },
      zhaopin: {
        alias: ['z'],
        boolean: true,
        describe: '将 npm 默认 registry 设置为http://npm.zhaopin.com'
      }
    },

  ]
}
