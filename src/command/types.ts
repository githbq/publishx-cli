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
        const cmdStr = data.remove ? `yarn remove @types/${name}` : `yarn add --dev @types/${name}`
        if (data.remove && data.lib) {
            const removeLibStr = `yarn remove ${name}`
            consoleColor.start(removeLibStr)
            await exec(removeLibStr)
        }
        consoleColor.start(`${cmdStr}`)
        await exec(cmdStr)
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
            },
            lib: {
                alias: ['l'],
                boolean: true,
                default: false,
                describe: '移除types库时,连同库一起移除'
            }
        }
    ]
}