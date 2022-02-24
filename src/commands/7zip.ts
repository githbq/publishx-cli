import * as zCompresser from '7zip-min'
import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 忽略node_modules与.git对当前工程压缩成一个zip包放置在dist文件夹下
 */
export default {
    /**
     * 启动
     */
    async start({ file }) {
        const filePath = `${file}`.endsWith('.7z') ? `${file}` : `${file}.7z`
        const newFilePath = io.pathTool.isAbsolute(filePath) ? filePath : io.pathTool.resolve(cwd, filePath)
        const destDir = newFilePath.replace(/\.7z$/, '')

        io.empty(destDir)
        consoleColor.yellow(`文件路径:${newFilePath}`)
        consoleColor.yellow(`压解到:${destDir}...`) 

        await new Promise((resolve, reject) => {
            zCompresser.unpack(newFilePath, destDir, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        }
        )
        consoleColor.green(`解压完成，文件夹：${destDir}`, true)
    },
    command: [
        '<file>',
        '对.7z文件进行解压缩',
        {

        }
    ]
}
