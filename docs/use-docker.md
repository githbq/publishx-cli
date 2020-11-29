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

docker run --name mysql-1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -v /D/docker-mysql-1:/var/lib/mysql -d mysql

docker run --name mysql-1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root  mysql -d mysql
