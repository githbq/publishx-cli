import { _, requireCwd, prompt, exec, getCurrentBranchName, cwd, consoleColor, io, packageHelper } from '../lib'
import { Observable } from 'rxjs'
import * as  delay from 'delay'
import * as Listr from 'listr'
import * as inquirer from 'inquirer'
/**
 * 测试用
 */
export default {
    /**
     * 启动
     */
    async start(data) {
          const res = await prompt('请输入姓名', '123')
        console.log('xxx', res)
    },
    command: [
        '测试用不要使用',
        {
            param: {
                string: true,
                describe: '测试参数',
                usage: 'Usage: $0 -w [num] -h [num]'
            }
        }
    ]
}