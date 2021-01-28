import { _, _Promise, exec, getCurrentBranchName, cwd, consoleColor, io, packageHelper } from '../lib'
import show from './show'
import * as Listr from 'listr'

const fileVersionToken = 'file:'
/**
 * 安装node项目库
 */
export default {
    async removeNodeModules() {
        try {
            consoleColor.start('rimraf **/node_modules')
            await Promise.all(
                ['**/node_modules'].map(
                    pattern => io.rimraf(pattern)
                )
            )
        } catch (e) { }
    },
    computLevel(packageModels, depedPackageNames = [], level = 0) {
        const levelPackageModels = []
        const remainingPackageModels = packageModels.filter(n => {
            let result = false
            const keyVersions = Object.keys(n.deps)
                .map(key => ({ key, version: n.deps[key] }))
            if (level === 0) {
                result = !keyVersions
                    .some(item => item.version.indexOf(fileVersionToken) !== -1)
            } else {
                result = keyVersions
                    .every(({ key }) => depedPackageNames.indexOf(key) !== -1)
            }

            if (result) {
                n.level = level
                levelPackageModels.push(n)
            }
            return !result
        })

        if (remainingPackageModels.length) {
            const preDepedPackageNames = depedPackageNames.concat(levelPackageModels.map(n => n.packageJSON.name))
            this.computLevel(remainingPackageModels, preDepedPackageNames, level + 1)
        }
    },
    makeTask(path) {
        let tool = this.tool
        let cmdStr = ''
        if (tool === 'yarn') {
            cmdStr = `${tool} install --no-save --no-lockfile`
        }
        else {
            cmdStr = `${tool} install  --no-save --no-shrinkwrap --no-package-lock`
        }
        const title = `${tool} install @ ${path}`
        return { title, task: () => exec(cmdStr, { cwd: path, preventDefault: true }).catch(error => { }) }
    },
    tool: '',
    /**
     * 启动
     */
    async start(data) {
        const tasks = []
        await this.removeNodeModules()
        this.tool = data.yarn ? 'yarn' : 'npm'

        const pathModels = await show.findProjectPaths()

        let packageModels = pathModels.map(n => ({ path: n.path, packageJSON: packageHelper.getSync(io.pathTool.resolve(n.path)), deps: null, level: 0 }))
        packageModels.forEach(n => n.deps = { ...n.packageJSON.devDependencies, ...n.packageJSON.dependencies })
        // 计算出依赖层级 
        this.computLevel(packageModels)
        const packageModelDic = {}
        packageModels.forEach(n => {
            packageModelDic[n.level] = packageModelDic[n.level] || []
            packageModelDic[n.level].push(n)
        })
        Object.keys(packageModelDic).forEach(level => {
            const levelPackageModels = packageModelDic[level]
            tasks.push({
                title: `安装 level${level} 级工程`,
                task: () => {
                    return new Listr([...levelPackageModels.map(n => this.makeTask(n.path))])
                }
            })
        })

        const taskManager = new Listr(tasks)
        await taskManager.run()
        consoleColor.green(`${this.tool} install 完毕\n\n`, true)
    },
    command: [
        '默认执行 yarn install',
        {
            npm: {
                alias: 'n',
                describe: '使用npm安装库',
                boolean: true,
                default: false
            },
            yarn: {
                alias: 'y',
                describe: '使用yarn安装库',
                boolean: true,
                default: false
            },
            concurrent: {
                alias: 'c',
                describe: '普通工程并发安装数',
                number: true,
                default: 2
            }
        }
    ]
}