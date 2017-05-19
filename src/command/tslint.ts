import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
/**
 * 生成ignore文件
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        await this.copyFile(data.npm)
    },
    async copyFile() {
        const fileNames = ['tslint.json']
        for (let fileName of fileNames) {
            const content = await io.read(fileName, { fromRoot: true })
            consoleColor.green(`正在当前目录生成 ${fileName} 文件`)
            await io.write(fileName, content, { fromCwd: true })
        }
        consoleColor.green(`生成成功 ${fileNames.join(',')}`, true)
        consoleColor.green(`请在 package.json scripts 增加 {"lint": "tslint \\\"src/**/*.ts\\\""} `)
    },
    command: [
        'tslint',
        '生成tslint配置文件',
        {
        }
    ]
}