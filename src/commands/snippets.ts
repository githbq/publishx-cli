

import { io, cwd } from '../lib'
/**
 * 配置vscode snippets
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const filePath = data.file
        if (filePath && io.existsSync(filePath)) {
            const content = await io.read(data.file)
            let dirPath = io.pathTool.dirname(filePath)
            if (!io.pathTool.isAbsolute(dirPath)) {
                dirPath = io.pathTool.resolve(cwd, dirPath)
            }
            const fileName = io.pathTool.basename(filePath, io.pathTool.extname(filePath))
            const newFilePath = io.pathTool.join(dirPath, `${fileName}.code-snippets`)
            console.log('newFilePath', this.getContent(content))
            await io.write(newFilePath, this.getContent(content))
        }

    },
    getContent(content) {
        const result =
            ` 
    {

      "create demo snippets": {
          "scope": "javascript,typescript",
          "prefix": "demo",
          "body": [ 
${content.split(/\r|\n/g).map(n => `"${n.replace(/"/g, '\\"')}"`).join(',\n')}
          ],
          "description": "demo snippets"
      }
  }
    `
        return result
    },
    command: [
        '<file>',
        '将指定文件生成 snippets',
        {
        }
    ]
}
