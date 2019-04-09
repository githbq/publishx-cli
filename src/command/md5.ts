import axios from 'axios'
import * as crypto from 'crypto'

import { _, packageHelper, exit, exec, getCurrentBranchName, consoleColor, cwd, io } from '../lib'

/**
 * 推送远程服务器对应分支的代码
 */
export default {
  /**
   * 启动
   */
  async start({ target }) {
    if (target.indexOf('http') !== -1) {
      const hash = crypto.createHash('md5')
      const { data } = await axios.get(target)
      hash.update(data)
      const contentHash = hash.digest('hex')
      consoleColor.green(`路径:${target} => hash:[${contentHash}]    || 文件内容长度:${data.length}`)
    }
    else {
      let files = []
      if (await io.fs.isDirectoryAsync(io.pathTool.join(cwd, target))) {
        files = await io.globby(['*.*', '!*.map'], { cwd: io.pathTool.join(cwd, target), absolute: true, dot: false, nodir: true })
      } else {
        files = [target]
      }
      for (let file of files) {
        if (await io.exists(file)) {
          const hash = crypto.createHash('md5')
          const content = await io.read(file)
          hash.update(content)
          const contentHash = hash.digest('hex')
          consoleColor.green(`路径:${io.pathTool.relative(cwd, file)} => hash:[${contentHash}]    || 文件内容长度:${content.length}`)
        }
        else {
          consoleColor.red(`路径文件:${file}不存在`)
        }
      }
    }
  },
  command: ['md5 <target>', '查看远程或者本地文件的md5值',
    {

    }
  ]
}