//sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"


import { _, exec, getCurrentBranchName, cwd, consoleColor, io } from '../lib'
/**
 * 生成ignore文件
 */
export default {
    /**
     * 启动
     */
    async start(data) {
        const cmds = [
            `apt-get update`,
            `apt-get install zsh`,
            `touch ~/.zshrc`,
            `sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`,
            `apt-get install nodejs`,
            `apt-get install npm`,
            `npm config set registry http://registry.npm.taobao.org`

        ]
    },
    command: [
        'wsl init',
        {
        }
    ]
}
