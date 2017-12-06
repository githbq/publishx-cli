![example](./logo.png)

> 多功能命令 `px` ,简化git操作，一些常用的批量操作

## 安装
> npm install -g publishx-cli

## 命令
> `publishx` 或者 `px`

### px start [comment] [-p] [-f] [-v]
- `px start` 用于简化:
    - npm run lint //代码风格校验[自动检测] *失败终止后续操作*
    - npm run tsc //typescript编译[自动检测]  *失败终止后续操作*
    - git add && git commit  //本地提交
    - git push [--force] //远程提交
    - auto upgrade version //版本自动化升级
    - npm publish  //发布到npmjs
- `p` publish,当设置`-p`参数,会执行`npm publish`命令,非必需
    - 添加参数`--tag`推送时自动`git tag -a v${newVersion} -m v${newVersion} && git push --tags`
- `f` force ,执行git push 时追加--force 强制推
- `v` autoVersion,自动增加版本号最后一位patch
    * 现在会执行`npm view [packageName] version`从远程获取版本号,避免版本号跳跃
    * 如果库没有被提交过，会走本地的package.json配置的版本号
-  分支名会自动取当前分支名
-  检测到 tsconfig.json 文件 会强制执行 npm run tsc 命令
- **2017-5-19 9:23** 新增逻辑,检测到package.json scripts里有配置`lint`属性
    - 会自动执行`npm run lint`
    - 失败会终止后续行为

### px show
- 显示当前目录下的所有项目

### px update [-r]
- 对当前目录下找出所有nodejs 受git管理的项目,执行`git remote update`
- `-r` reset 启动此参数会 强制git reset --hard origin/当前分支
- 执行 `px show` 可以看到这些会被更新的项目

### px types "lodash" [-r] [-l]
-  `-r` remove , yarn add|remove --dev @types/xxx
- `-l` lib,移除types库时,连同库一起移除

### px install
- 对查找出来的所有项目执行 yarn

### px ignore [-n]
- 在当前目录生成 .gitignore
- -n 生成 .npmignore

### px tsconfig
- 生成tsconfig.json文件

### px commit [comment]
- 对当前目录执行 git add . && git commit [comment]

### px copy [target]  [-c]
- 项目里面如果有node_modules文件夹,拷贝速度奇慢无比
- 忽略掉这些不应该拷贝的文件,如：node_modules|types|build|dist|temp
- 对100个项目拷贝,只需要在它们的父目录上执行`px copy [target]` 仅需上十秒就能完成仓库搬家
- 当前目录 或者当前目录找出来的所有node项目 复制到target目录
- 目录文件夹会自动创建
- `-c` concurrent 开启并发

### px tslint
- 在当前目录生成 tslint.json文件

### px yarn [-t] [-n]
- 显示当前yarn registry , -t　taobao -n npmjs，将yarn registry指向taobao 或者 npmjs

### px npm [-t] [-n]
- 显示当前npm registry , -t　taobao -n npmjs,npm registry指向taobao 或者 npmjs

### px git init
- 初始化 git 常用参数

### px merge [branch]
- git merge ${branch} --no-ff --no-commit
- merge 前会自动执行 px commit `beforeMerge`,降低失误率

### px clone [url] -b? [branch] -n? [projectName]
- 更便捷的 `git clone`
- 默认参数 `--recursive` 自动 `git clone git submodules`
- 自动打开 `vscode` 开发工具
- 自动对生成的项目执行 `yarn` 进行装库操作
- 执行步骤
  1. `git clone` //失败后 终止后续行为
  2. `code .` //失败后静默
  3. `yarn` //失败后静默

### `px checkout -b? <branchName>`
-  先执行 `git remote update` 然后 `git checkout <branchName>`
- `-b` 是否新建并切换到 对应的分支名 `git checkout -b <branchName>`
### px stylelint
- 生成 `.stylelintrc.json` 文件

### px sync
- 对当前项目进行 `git clean -df && git checkout . && git pull origin [currentBranch]`

### px init
- 执行开发环境初始化准备工作
1. 将npm升级到最新版: npm i -g npm
2. 安装全局跨平台删除命令rimraf: npm i -g rimraf
3. 安装全局命令 yarn: npm i -g yarn
4. 安装 iclone-cli 脚手架工具: npm i -g iclone-cli
5. 将 yarn registry切换到淘宝npm:     px yarn -t
6. 安装全局命令 cnpm: npm i -g cnpm
7. 初始化 git 默认行为:px git init

## 查看帮助

- 在对应的命令后面增加　`--help`
    * px --help
    * px start --help
