# 使用git时遇到的问题 以及解决办法

## .git/.MERGE_MSG.swp 提示
> 执行`rimraf .git/.MERGE_MSG.swp` 删除对应的.git文件 再重新 `git add . && git commit -am "msg"`即可以解决问题