

import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'
import { EOL } from 'os'
/**
 * 删除 debugger
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const result = await io.globby(
            ['{packages,src,scripts}/**/*.[t,j]s', '!**/node_modules/**'],
            {
                nodir: true,
            },
        )
        console.log(result)
        const promises = result.map(async filePath => {
            const content = await io.read(filePath)

            const lines = content.split(EOL)

            const filteredLines = lines.filter(
                line => !/^\s*debugger;?\s*$/.test(line),
            )
            const newContent = filteredLines.join(EOL)
            await io.write(filePath, newContent)
        })
        await Promise.all(promises)
        consoleColor.green('clear ts&js file debugger completed', true)
    },
    command: [
        '清理代码中的 debuger 行',
        {
        }
    ]
}
