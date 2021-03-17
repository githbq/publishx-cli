import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'
import GlobbyCompress from 'globby-compress'
/**
 * 忽略node_modules与.git对当前工程压缩成一个zip包放置在dist文件夹下
 */
export default {
    /**
     * 启动
     */
    async start({ name }) {
        const fileName = (name || packageHelper.getProjectName(cwd)).replace(/\.zip$/, '')
        const zipPath = `./dist/${fileName}.zip`
        const globbyCompress = new GlobbyCompress(zipPath,
            [
                '**/*',
                '!**/node_modules/**/*',
                '!**/dist/**/*',
                '!**/.git/**/*',
                '!**/temp.*',
                '!**/.DS_Store/**/*',
                '!**/.DS_Store'
            ], { cwd })
        try {
            consoleColor.green('压缩文件夹中...')
            const bytes: any = await globbyCompress.compress()
            consoleColor.green('压缩完成，文件路径:' + zipPath, true)
            consoleColor.green('共' + (Math.floor(bytes / 1024) || 0) + 'KB')
        } catch (e) {
            console.error(e)
        }
    },
    command: [
        '对当前项目打包，打包文件放置在dist文件夹，文件名为:[工程名].zip',
        {
            name: {
                alias: 'n',
                describe: '文件名',
                string: true,
                default: ''
            },
        }
    ]
}
