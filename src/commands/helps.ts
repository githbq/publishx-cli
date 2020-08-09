

import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

class Help {
  public description: string
  public solution: string
  constructor(description, solution) {
    this.description = description
    this.solution = solution

  }

}
/**
 * 帮助信息
 */
export default {
  /**
   * 启动
   */
  async start(data) {
    const helps = [
      new Help('macos下无法安装brew', '$>:  /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"'),
      new Help('macos nginx 安装目录在哪？', '1. macos nginx 安装目录 /usr/local/etc/nginx ; 2. nginx -V')
    ]

    helps.forEach(n => {
      consoleColor.green(
        `问题描述：${n.description}
解决方案：${n.solution}`)
    })
  },
  command: [
    '帮助信息 ',
    {
    }
  ]
}
