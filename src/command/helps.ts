

import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 帮助信息
 */
export default {
  /**
   * 启动
   */
  async start(data) {
     consoleColor.green(
         `macos下无法安装brew解决方法:
         $>:  /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"`)
  },
  command: [
    'helps', '帮助信息 ',
    {
    }
  ]
}
