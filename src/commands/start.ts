import { _, packageHelper, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'
import * as semver from 'semver'
/**
 * 推送代码到远程服务器
 */
export default {
  /**
   * 启动
   */
  customRegistry: null,
  async start(data) {
    let cmdArr = []
    const packageJSON = await packageHelper.get(cwd)
    if (packageJSON.publishConfig) {
      consoleColor.green(`
    请确保已在相应的 registry 登录:
    npm adduser --registry=${packageJSON.publishConfig.registry}
    `)
      this.customRegistr = packageJSON.publishConfig.registry
      console.log('packageJSON.publishConfig.registry', this.customRegistr)
    }
    const isTs = await io.exists(io.pathTool.join(cwd, 'tsconfig.json'))
    if (packageJSON.scripts['lint'] && !packageJSON['pre-commit'] && !data.noVerify) {
      cmdArr.push({ key: 'lint', value: 'npm run lint' })
    }
    if (isTs) {
      //ts检测
      if (packageJSON.scripts['tsc'])
        cmdArr.push({ key: 'tsc', value: 'npm run tsc' })
    }
    let newVersion = packageJSON.version || '1.0.0'
    if (data.autoVersion) {
      //自动生成版本号
      cmdArr.push({
        key: 'auto update package version', value: async () => {
          //以cwd目录执行版本++
          newVersion = await this.upgradeVersion()
        }
      })
    }
    const branchName = await getCurrentBranchName()//当前项目分支名
    cmdArr = cmdArr.concat([
      { key: 'add & commit', value: `git add . && git commit -am "${data.comment}" ${data.noVerify ? '--no-verify' : ''}` },
      { key: 'push', value: `git push origin ${branchName}` }
    ])

    if (data.force) {//强推
      const pushConfig: any = _.find(cmdArr, n => n.key === 'push')
      pushConfig && (pushConfig.value += ` --force`)
    }
    if (data.publish) {
      cmdArr.push({ key: 'publish', value: 'npm publish' })
    }
    if (data.tag) {
      cmdArr.push({
        key: 'tagAdd', value: async () => {
          let tagCmdStr = `git tag -a v${newVersion} -m "v${newVersion}" && git push origin --tags`
          consoleColor.start(tagCmdStr)
          await exec(tagCmdStr)
        }
      })
    }
    for (let cmd of cmdArr) {
      try {
        if (_.isFunction(cmd.value)) {
          consoleColor.start(cmd.key)
          await cmd.value()
        }
        else {
          consoleColor.start(cmd.value)
          await exec(cmd.value)
        }
      } catch (e) {
        if (cmd.key === 'commit') {

        }
        else if (cmd.key === 'lint') {
          consoleColor.red(`npm run lint ,代码风格校验失败，请检查代码后再执行`)
          break
        }
        else if (cmd.key === 'tsc') {//如果tsc失败 直接跳出
          consoleColor.red(`typescript 编译 失败！请检查代码后再执行`)
          break
        }
        else if (cmd.key === 'push') {//如果push失败 直接跳出
          consoleColor.red(`提交到远程仓库失败！请检查代码是否与远程同步`)
          break
        } else {
          consoleColor.red(`执行${cmd.key}发生异常:${e.message}`, false)
        }
      }
    }
    consoleColor.green('操作完毕!!!', true, true)
  },
  /**
   * 升级版本
   */
  async upgradeVersion() {
    console.log('this.customRegistry', this.customRegistry)
    return 
    const packageJson = await packageHelper.get()
    let currentVersion = packageJson.version
    let newVersion
    try {
      console.log('customRegistry', this.customRegistry)
      const cmdStr = `npm view ${packageJson.name} version${this.customRegistry ? ` --registry=${this.customRegistry}` : ''}`
      consoleColor.start(cmdStr)
      const versionData = await exec(cmdStr, { preventDefault: true })
      console.log('versionData', versionData)
      currentVersion = versionData.stdout.replace(/\n/g, '')
    } catch (e) {
      //查询库在npm上的版本异常说明此库没有提交过
      newVersion = currentVersion
    }
    consoleColor.green(`当前版本:${currentVersion}`)
    newVersion = newVersion || semver.inc(await packageHelper.getVersion(currentVersion, cwd), 'patch')
    consoleColor.green(`升级到新版本:${newVersion}`)
    packageJson.version = newVersion
    await packageHelper.write(packageJson)
    return newVersion
  },
  command: [
    '<comment>',
    '提交 [comment]',
    {
      autoVersion: {
        alias: ['v'],
        boolean: true,
        describe: '自动增量版本号patch'
      },
      publish: {
        alias: ['p'],
        boolean: true,
        describe: '执行 npm publish 命令'
      },
      force: {
        alias: ['f'],
        boolean: true,
        describe: '强制git push'
      },
      tag: {
        alias: ['t'],
        boolean: true,
        default: false,
        describe: 'npm publish时自动添加tag'
      },
      noVerify: {
        alias: ['n'],
        boolean: true,
        describe: '是否不验证 --no-verify'
      }
    }]
}
