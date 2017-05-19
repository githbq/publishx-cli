import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
/**
 * 生成ignore文件
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        await this.copyIgnore(data.npm)
    },
    async copyIgnore(gengerNpmIgnore) {
        const fileNames = ['.gitignore']
        if (gengerNpmIgnore) {
            fileNames.push('.npmignore')
        }
        for (let fileName of fileNames) {
            const content = await io.read(fileName, { fromRoot: true })
            consoleColor.green(`正在当前目录生成 ${fileName} 文件`)
            await io.write(fileName, content, { fromCwd: true })
        }
        consoleColor.green(`生成成功 ${fileNames.join(',')}`, true)
    },
    command: [
        'ignore',
        '生成忽略文件',
        {
            npm: {
                alias: ['n'],
                boolean: true,
                describe: '生成.npmignore'
            },
        }
    ]
}