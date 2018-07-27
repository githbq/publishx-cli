


import { _, packageHelper, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'
/**
 * 删除 node_modules
 */
export default {
  /**
   * 启动
   */
  async start(data) { 
    consoleColor.green(`-------process.cwd:${process.cwd()}-------`)
    consoleColor.time(`全部执行完成`)
    const directories = [
      'node-c-pcweb-home',
      'node-c-pcweb-i',
      'node-c-pcweb-sou',
      'node-c-pcweb-company',
      'nodeapi-c-pcweb-i',
      'node-c-pcweb-job'
    ]
    const promises = []
    for (const project of directories) {
      console.log(`project:${project}`)
      const cwd = `/Users/biqing.hu/Documents/workspace/` + project
      const checkoutMaster = `git checkout . && git clean -df && git checkout master && git pull origin master`
      const createQA = `git checkout -b qa/1.0`
      const pushOrigin = `git push origin qa/1.0`
      const cmdStrs = [...checkoutMaster.split('&&'), createQA, pushOrigin]

      promises.push(async () => {
        for (const cmdStr of cmdStrs) {
          consoleColor.yellow(`开搞项目:${project}`)
          consoleColor.time(`开搞项目完成:${project}`)
          consoleColor.start(cmdStr)
          try {
            await exec(cmdStr, { cwd })
            consoleColor.timeEnd(`开搞项目完成:${project}`)
            consoleColor.green(`开搞项目结束:${project}`, true, true)
          } catch (error) {
            consoleColor.error(error)
          }
        } 
        consoleColor.green(`----------------------------------`)
      })
    }
    await Promise.all(promises.map(cb=>cb()))
    consoleColor.timeEnd(`全部执行完成`)
  },
  command: [
    'newbranch', '创建各项目的 qa分支',
    {
    }
  ]
}


