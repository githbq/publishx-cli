下载地址：

docker run -d --name mysql -e MYSQL_ROOT_HOST=% -e MYSQL_ROOT_PASSWORD=root -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysql -p 3307:3306 -v /d/mysql-data/mysql-1:/var/lib/mysql mysql

{
  "registry-mirrors": [

    "https://docker.mirrors.ustc.edu.cn/"

  ], 
  "insecure-registries": [], 
  "debug": false, 
  "experimental": true, 
  "storage-driver": "devicemapper"
}

docker run -d --name mysql-1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -v /D/docker-mysql-1:/var/lib/mysql mysql

docker run -d --name mysql-1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root  mysql

## 进入容器内部 

docker exec -it mysql-1  /bin/bash
 

## navicat 连接 mysql 报错

> Client does not support authentication protocol requested by server; consider upgrading MySQL client

### 解决方案

1. 进入 mysql-1 容器

``` 

docker exec -it mysql-1 bash
```

2. mysql-1容器内进入 mysql

``` 

mysql -u root -p 
```

> 会提示请求密码，输入 `root` 即可, 看见 `welcome` 提示语则说明连接成功

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
// 修改用户密码
alter user 'root'@'%' identified with mysql_native_password by '111111'; //111111是自己新修改的密码。
// 刷新用户权限
mysql> flush privileges;
// 再次检查
select user,host,plugin from user where user='root';
// 显示出 % 与 localhost 两种 host 都为 mysql_native_paassword 即为成功
```
