import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../../lib'
import * as template from './template';
import helps from './helps';
/**
 * 推送代码到远程服务器
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        consoleColor.yellow(`
        // package.json nginxConfig 配置示例
        {
            serverRootPath: '/export/local/www/',
            appName: packageHelper.getProjectName() || packageJSON.name,
            backendHost: '127.0.0.1'
        }
        `)
        if (data.create) {
            const packageJSON = await packageHelper.get();

            consoleColor.green('读取package.json文件完成')
            if (!packageJSON.enginxConfig) {
                consoleColor.green('开始初始化nginxConfig节点')
                packageJSON.enginxConfig = {
                    port: '8111',
                    serverRootPath: '/export/local/www/',
                    appName: packageHelper.getProjectName() || packageJSON.name,
                    backendHost: '127.0.0.1'
                }
                packageHelper.write(packageJSON)
                consoleColor.green('nginxConfig节点回写package.json文件完成')
            }
            consoleColor.green('准备生成项目nginx.conf配置');
            const nginxStr = template.getTemplateStr(packageJSON.enginxConfig)
            await io.write('nginx.conf', nginxStr)
            consoleColor.green('项目nginx.conf配置已生成');
        }
        if (data.help) {
            consoleColor.green(helps)
        }

    },
    command: [
        'nginx', 'nginx配置帮助',
        {
            create: {
                alias: ['c'],
                boolean: true,
                describe: '创建nginx配置'
            },
            help: {
                alias: ['h'],
                boolean: true,
                describe: '显示帮助信息'
            },
        }
    ]
}
