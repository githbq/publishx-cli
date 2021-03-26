import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 合并当前分支与指定分支的代码
 */
export default {
  /**
   * 启动
   */
  async start({ branch }) {
    if (!branch) {
      consoleColor.red('缺少 分支名 , 提示: px merge dev')
    }
    const currentBranchName = await getCurrentBranchName()//当前项目分支名
    consoleColor.yellow('提示:默认开启 --no-ff --no-commit merge时不自动commit  非快照式合并!')
    //commit
    consoleColor.green('提示: 在merge前会自动提交一次当前代码以防止出现意外')
    const commitCmdStr = `px commit beforeMerge`
    consoleColor.start(commitCmdStr)
    try {
      await exec(commitCmdStr)
    } catch (e) {
    }
    //merge
    // --allow-unrelated-histories 允许未历史关联分支
    const cmdStr = `git merge ${branch} --no-ff --no-commit`
    consoleColor.start(cmdStr)

    try {
      await exec(cmdStr)
    } catch (e) {
    }
  },
  command: [
    '<branch>', 'git merge <branch> --no-ff --no-commit',
    {
    }
  ]
}
