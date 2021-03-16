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

        await this.findProjectPaths(data.all)
    },
    async findProjectPaths(all: boolean = false): Promise<Array<PathModel>> {
        const spinner = consoleColor.showSpiner(`正在分析目录:${cwd}`)
        let paths: Array<string> = null
        if (all) {
            paths = await io.globby(['**/.git', '!**/{.git,node_modules,workspace,git-workspace}/**/*'], { dot: false, nodir: false })
        } else {
            paths = await io.globby(['**/package.json', '!**/{__test__,__mocks__,node_modules,types,example,examples,build,temp,template,templates,dist}/**'], { dot: false })
        }
        spinner.ok(`目录${cwd}分析结束`)
        let count = 1
        const projects: Array<PathModel> = []
        //将路径转换到上一级 也就是文件夹
        paths = paths.map(n => io.pathTool.dirname(n))
        for (let projectPath of paths) {
            const isGit = await io.exists(io.pathTool.join(projectPath, '.git'))
            let pathModel = { path: projectPath, isGit }
            projects.push(pathModel)
            consoleColor.green(`[${count++}]` + projectPath.replace(/\\/g, '/') + (!isGit ? '  非 git 项目!' : ''), true)
        }

        consoleColor.white(`查找到${paths.length}个目标`)
        return projects
    },
    command: [
        '显示当前项目下的所有项目',
        {
            all: {
                alias: ['a'],
                boolean: true,
                default: true,
                describe: '是否查找所有工程，即使没有package.json文件'
            },
        }
    ]
}