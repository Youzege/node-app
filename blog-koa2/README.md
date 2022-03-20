## Koa2 框架



**脚手架**

安装：`npm install koa-generator -g` `npm i cross-env -D`

使用：`Koa2 blog-koa2`



#### 直接开发接口

##### 登录路由

插件：`koa-generic-session` `koa-redis`



##### 日志插件

`koa-morgan`



#### centOS 安装NodeJS、npm



```
sudo yum install epel-release

sudo yum install nodejs

sudo yum install npm --enablerepo=epel
```



#### centOS 安装 mysql



**先检查系统是否安装有mysql**

```
yum list installed mysql*
```



**查看有没有安装包**

```
yum list mysql*
```



**安装mysql客户端**

```
yum install mysql
```



**安装mysql服务端**

```
yum install mysql-server

CentOS7自带有MariaDB而不是MySQL，MariaDB和MySQL一样也是开元的数据库
如果必须要安装MySQL，首先必须添加mysql社区repo通过输入命令：

sudo rpm -Uvh http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm

执行完后,则继续执行：

yum install mysql-server 

yum install mysql-devel
```



**在/etc/my.cnf 文件中加入默认字符集**

```
vim /etc/my.cnf
```



**启动或关闭mysql服务**

```
service mysqld start 启动

service mysqld stop 停止

lsof -i:3306 查看端口
```



**设置开机启动mysql服务**

```
chkconfig --add mysqld 
```



**创建root管理员**

```
mysqladmin -u root password 密码
```



**进入mysql容器中**

输入密码不显示，直接输入完回车，可能是某种安全措施不显示密码

```
mysql -u root -p  
```



**设置允许远程访问**

**开放防火墙的端口号**

**mysql增加权限：mysql库中的user表新增一条记录host为“%”，user为“root”。**



```
use mysql;

UPDATE user SET `Host` = '%' WHERE `User` = 'root' LIMIT 1;
```

**%表示允许所有的ip访问**







#### centOS 防火墙开端口



```
开端口命令：firewall-cmd --zone=public --add-port=80/tcp --permanent
重启防火墙：systemctl restart firewalld.service
 
命令含义：
 
--zone #作用域
 
--add-port=80/tcp  #添加端口，格式为：端口/通讯协议
 
--permanent   #永久生效，没有此参数重启后失效


firewall-cmd --reload 重启防火墙

firewall-cmd --list-port查看已生效的端口
```



#### centOS 安装redis



**安装redis**

```
yum install redis
```

**安装依赖**

```
yum install epel-release
```

**redis命令**

```


# 启动redis
service redis start
# 停止redis
service redis stop
# 查看redis运行状态
service redis status
# 查看redis进程
ps -ef | grep redis
```



**开机启动**

```
chkconfig redis on
```



#### centOS 安装PM2

通过nodejs安装即可