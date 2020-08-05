import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'
import * as  zipPaths from 'zip-paths'
/**
 * 忽略node_modules与.git对当前工程压缩成一个zip包放置在dist文件夹下
 */
export default {
    /**
     * 启动
     */
    async start() {
        consoleColor.time('耗时')
        const zipPath = `./dist/${packageHelper.getProjectName()}.zip`
        const zip = new zipPaths(zipPath,
            { archiveType: 'zip' })
        await new Promise(resolve => {
            zip.add('**/*', {
                cwd: cwd,
                dot: true,
                ignore: [
                    '**/node_modules/**/*',
                    '**/dist/**/*',
                    '**/.git/**/*',
                    '**/temp.*',
                    '**/.DS_Store/**/*',
                    '**/.DS_Store'
                ]
            },
                function (err) {
                    if (err) {
                        consoleColor.error(err)
                        resolve
                    }
                    zip.compress((err, bytes) => {
                        consoleColor.green('压缩包路径:' + zipPath)
                        consoleColor.green('总共' + Math.floor(bytes / 1024) + 'KB')
                        resolve()
                    })
                })
        })
        consoleColor.timeEnd('耗时')
    },
    command: [
        'compress', '对当前项目打包，打包文件放置在dist文件夹，文件名为:[工程名].zip',
        {

        }
    ]
}
