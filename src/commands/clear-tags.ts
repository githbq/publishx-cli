import { _, packageHelper, exit, confirm, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'
import * as Listr from 'listr'

/**
 * 删除 node_modules
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    if (data.tagNames === 'all') {
      const cmdStr = 'git tag'
      consoleColor.start(cmdStr)
      try {
        const result = await exec(cmdStr)
        const tags = result.stdout.split('\n').filter(n => !!n)
        const yes = await confirm('是否要删除掉所有tags?')
        if (yes) {
          let count = 0
          let tasks = []
          for (let tag of tags) {
            tasks.push({
              title: `[count]: delete tag ${tag}`,
              task: async () => {
                try {
                  count++
                  const cmdDeleteTagStr = `git tag --delete ${tag} && git push origin :${tag}`
                  consoleColor.start(cmdDeleteTagStr)
                  await exec(cmdDeleteTagStr)
                } catch (e) {
                  consoleColor.error(e)
                } finally {
                  consoleColor.green(`剩余${tags.length - count}项`)
                }
              }
            })

          }
          const taskManager = new Listr(tasks, { concurrent: data.concurrent || 20 })
          await taskManager.run()

        }
      } catch (error) {
        consoleColor.error(error)
      }
      return
    }
    if (data.tagNames) {
      const tags = data.tagNames.split(',').filter(n => !!n)
      const cmdStrs = tags.map(n => {
        return `git tag --delete ${n} && git push origin :refs/tags/${n}`
      })
      for (let cmdStr of cmdStrs) {
        consoleColor.start(cmdStr)
        try {
          await exec(cmdStr)
        } catch (error) {
          consoleColor.error(error)
        }
      }
    }
  },
  command: [
    '<tagNames>', '多个tag以,分割  git tag --delete [tagName] && git push origin :refs/tags/[tagName]',
    {
      concurrent: {
        alias: ['c'],
        number: true,
        describe: '并发数'
      },
    }
  ]
}
