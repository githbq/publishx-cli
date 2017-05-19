import { _, requireCwd, exec, getCurrentBranchName, cwd, consoleColor, io, packageHelper } from '../lib'
/**
 * 安装types
 */
export default {
    /**
     * 启动
     */
    async start(data) {　
        //库名
        const name = _.trim(data.name).replace('@types/', '')
        //移除库
        const remove = data.remove
        const cmdStr = remove ? `yarn remove @types/${name}` : `yarn add --dev @types/${name}`
        consoleColor.start(`${cmdStr}`)
        consoleColor.time('耗时')
        await exec(cmdStr)
        consoleColor.timeEnd('耗时')
        const tsConfig = requireCwd('tsconfig.json')
        //从package.json读取当前可用的types填充tsconfig
        tsConfig.compilerOptions.types = this.getExistsTypes()
        await io.write('tsconfig.json', tsConfig, { fromCwd: true })
        consoleColor.green(`操作结束`, true)
    },
    getExistsTypes() {
        const packageJson = packageHelper.get()
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
        let types = Object.keys(allDeps).filter((n) => /^@types/.test(n)).map(n => n.replace('@types/', ''))
        types = _.sortBy(types, n => n)
        return types
    },
    command: [
        'types <name>',
        '安装@types/库',
        {
            remove: {
                alias: ['r'],
                boolean: true,
                describe: '移除此库 @types/name 以及tsconig types配置'
            }
        }
    ]
}