
import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
/**
 * 配置或者查看yarn registry
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const setRegistryStr = `yarn config set registry https://registry.npm.taobao.org`
        const setNpmRegistryStr = `yarn config set registry https://registry.npmjs.org`
        await this.showCurrentRegistry()
        if (data.taobao) {
            consoleColor.start(`${setRegistryStr}`)
            await exec(setRegistryStr)
        } else if (data.npm) {
            consoleColor.start(`${setNpmRegistryStr}`)
            await exec(setNpmRegistryStr)
        }
        if (data.taobao || data.npm) {
            await this.showCurrentRegistry()
        }
        consoleColor.green(`操作结束！`)
    },
    async showCurrentRegistry() {
        consoleColor.green('当前yarn registry地址:')
        await exec('yarn config get registry')
    },
    command: [
        'yarn',
        '配置或者查看yarn registry',
        {
            taobao: {
                alias: ['t'],
                boolean: true,
                describe: '将yarn 默认registry 设置为https://registry.npm.taobao.org'
            },
            'npm': {
                alias: ['n'],
                boolean: true,
                describe: '将npm 默认registry 设置为https://registry.npmjs.org'
            }
        },

    ]
}