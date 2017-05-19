import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
import types from './types'
const { getExistsTypes } = types
/**
 * 生成ignore文件
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        await this.copyTsConfig(data.npm)
    },
    async copyTsConfig(gengerNpmIgnore) {
        const fileName = 'tsconfig.json'
        const content = await io.read(fileName, { fromRoot: true })
        const tsconfigJson = JSON.parse(content)
        if (await io.exists('package.json', { fromCwd: true })) {
            tsconfigJson.compilerOptions.types = getExistsTypes()
        }
        consoleColor.green(`正在当前目录生成 ${fileName} 文件`)
        await io.write(fileName, tsconfigJson, { fromCwd: true })
        consoleColor.green(`生成成功 ${fileName}`, true)
    },
    command: [
        'tsconfig',
        '生成tsconfig文件',
        {

        }
    ]
}