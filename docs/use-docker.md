# 使用docker安装mysql教程

## 下载

<https://www.docker.com/products/docker-desktop>

## docker 配置

{
  "registry-mirrors": [

    "https://docker.mirrors.ustc.edu.cn/"

  ], 
  "insecure-registries": [], 
  "debug": false, 
  "experimental": true 
}
 

## 创建 mysql-1 容器

docker run -d --name mysql-1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root  mysql

## 进入容器内部 

docker exec -it mysql-1  /bin/bash
 

## navicat 连接 mysql 报错

``` shell
Client does not support authentication protocol requested by server; consider upgrading MySQL client
```

### 解决方案

1. 进入 mysql-1 容器

``` 

docker exec -it mysql-1 bash
```

2. mysql-1容器内进入 mysql

``` 

mysql -u root -p 
```

会提示请求密码，输入 `root` 即可, 看见 `welcome` 提示语则说明连接成功

3. 按接下来的步骤，完成用户账号密码类型的变更操作

``` 

// ( `mysql>` 进入容器内 mysql 标示，不用人工输入）
// 进入系统表
mysql> use mysql
// 查看用户信息 
mysql> select user,host,plugin from user where user='root';
// 修改用户密码类型，原样复制
mysql> alter user 'root'@'%' identified by 'password' password expire never;
// 修改用户密码类型，原样复制
mysql> alter user 'root'@'localhost' identified by 'password' password expire never;
// 修改用户密码，111111是自己新修改的密码。
alter user 'root'@'%' identified with mysql_native_password by '111111'; 
alter user 'root'@'%' identified with mysql_native_password by '111111';
// 刷新用户权限
mysql> flush privileges;
// 再次检查
select user,host,plugin from user where user='root';
// 显示出 % 与 localhost 两种 host 都为 mysql_native_paassword 即为成功
```

4. 在终端工具 `navcat for mysql` 验证，注意密码一致性

# redis 

## 安装 

``` 

docker pull redis 
```

docker run --name redis -p 6379:6379 -d --restart=always redis:latest redis-server --appendonly yes --requirepass "111111"
