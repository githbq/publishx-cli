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
    isGit: boolean
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
    async findProjectPaths(cb?: Function): Promise<Array<PathModel>> {
        const spinner = consoleColor.showSpiner(`正在分析目录:${cwd}`)
        consoleColor.time('耗时')
        let paths: Array<string> = await io.globby(['**/package.json', '!**/{__test__,__mocks__,node_modules,types,example,examples,build,temp,template,dist}/**'], { dot: false })
        //将路径转换到上一级 也就是文件夹
        paths = paths.map(n => io.pathTool.dirname(n))
        const projects: Array<PathModel> = []
        spinner.ok(`目录${cwd}分析结束`)
        let count = 1
        for (let projectPath of paths) {
            const isGit = await io.exists(io.pathTool.join(projectPath, '.git'))
            let pathModel = { path: projectPath, isGit }
            projects.push(pathModel)
            consoleColor.green(`[${count++}]` + projectPath.replace(/\\/g, '/') + (!isGit ? '  非git项目!' : ''), true)
        }

        consoleColor.white(`查找到${paths.length}个项目`)
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