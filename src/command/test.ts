import { _, requireCwd, exec, getCurrentBranchName, cwd, consoleColor, io, packageHelper } from '../lib'
import { Observable } from 'rxjs'
import * as  delay from 'delay'
import * as Listr from 'listr'
/**
 * 测试用
 */
export default {
    /**
     * 启动
     */
    async start(data) {

        const listtr = new Listr([
            {
                title: 'Checking git status',
                task: () => {
                    return new Observable(observer => {
                        observer.next('foo')

                        delay(2000)
                            .then(() => {
                                observer.next(`bar`)
                                return delay(2000)
                            })
                            .then(() => {
                                observer.complete()
                            })
                    })
                }
            },
            {
                title: 'Checking remote history',
                task: () => delay(2000)
            }
        ], { concurrent: true })
        await listtr.run()
    },
    command: [
        'test',
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