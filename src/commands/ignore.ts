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
  async copyIgnore(generateNpmIgnore) {
    const fileNames = ['template/template.gitignore']
    if (generateNpmIgnore) {
      fileNames.push('template/template.npmignore')
    }
    for (let fileName of fileNames) {
      const content = await io.read(fileName, { fromRoot: true })
      const newFilename = fileName.replace(/.*template/, '')
      consoleColor.green(`正在当前目录生成 ${newFilename} 文件`)
      await io.write(newFilename, content, { fromCwd: true })
      consoleColor.green(`生成成功 ${newFilename}`, true)
    }
  },
  command: [ 
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
