import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
import * as globby from 'globby'
interface PathModel {
    /**
     * 相对cwd的路径 
     */
    path: string
    /**
     * 是否git项目
     */
    isGit: boolean,
    // 表示该 path 是一个文件路径而非项目文件夹路径
    isFilePath?: boolean
}
/**
 * 查看当前目录所有git项目
 */
export default {
    /**
     * 启动
     */
    async start(data) {

        await this.findProjectPaths()
    },
    async findProjectPaths(allFiles: boolean = false): Promise<Array<PathModel>> {
        const spinner = consoleColor.showSpiner(`正在分析目录:${cwd}`)
        consoleColor.time('耗时')
        let paths: Array<string> = null
        if (allFiles) {
            paths = await io.globby(['**/*', '!**/{__test__,__mocks__,node_modules,types,build,temp,template,templates,dist}/**'], { dot: false })
        } else {
            paths = await io.globby(['**/package.json', '!**/{__test__,__mocks__,node_modules,types,example,examples,build,temp,template,templates,dist}/**'], { dot: false })
        }
        //将路径转换到上一级 也就是文件夹
        paths = paths.map(n => io.pathTool.dirname(n))
        const projects: Array<PathModel> = []
        spinner.ok(`目录${cwd}分析结束`)
        let count = 1
        if (!allFiles) {
            for (let projectPath of paths) {
                const isGit = await io.exists(io.pathTool.join(projectPath, '.git'))
                let pathModel = { path: projectPath, isGit }
                projects.push(pathModel)
                consoleColor.green(`[${count++}]` + projectPath.replace(/\\/g, '/') + (!isGit ? '  非 git 项目!' : ''), true)
            }
        } else {
            for (let filePath of paths) {
                let pathModel = { path: filePath, isGit: false, isFilePath: true }
                projects.push(pathModel)
            }
        }
        consoleColor.white(`查找到${paths.length}个目标`)
        consoleColor.timeEnd('耗时')
        return projects
    },
    command: [
        'show',
        '显示当前项目下的所有项目',
        {

        }
    ]
}