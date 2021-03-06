## 🐰MySQL 数据库



用户：root

密码：123456



可视化工具：wrokbench





#### 📦操作数据库SQL基础

- 建库
- 建表
- 表操作 SQL语句



#### 建库

```sql
CREATE SCHEMA `nodeblog`
```



#### 建表

##### 用户信息表

```sql
CREATE TABLE `nodeblog`.`users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `realname` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) 
COMMENT='用户信息表'
```

##### 博客信息表

```sql
CREATE TABLE `nodeblog`.`blogs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(50) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `createtime` BIGINT(20) NOT NULL DEFAULT 0,
  `author` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`))
COMMENT = '博客信息表';
```



#### 操作表

- **增删改查 **的操作
- 基础SQL语句



##### use xxx 

使用某个数据库

例子：

```sql
use nodeblog;
```



##### show tables

查看所有表

例子：

```sql
show tables; 
```



##### insert into 

表中插入数据

insert into `表名` (字段1, 字段2, ...) values (值1, 值2, ...);

例子：

```sql
insert into users (username, `password`, realname) values ('youzege', '123', '你泽哥');

insert into blogs (title, content, createtime, author) values ('标题A', '内容A', '1647357512634', 'youzege');
```



##### select from

查询表中的数据

select 查询字段from 表名 查询条件;

`where `  当符合条件时触发

`and & or`  条件

`like`  模糊查询

`<>`  表示不等于

例子：

```sql
-- 查询所有
select * from users;

-- 查询 id，username
select id, username from users;

-- 查询条件where
select * from users where username='youzege';

-- 查询条件 多个条件 and
select * from users where username='youzege' and `password`='123';

-- 查询条件 多个条件 or
select * from users where username='youzege' or `password`='123';

-- 查询条件 模糊查询 like '% xxx %' 前后 % 
select * from users where username like '%y%';

-- 查询版本
select version();
```



##### order

排序 默认正序

```sql
-- 查询后排序 order by xxx(排序字段)
select * from users where password like '%1%' order by id;

-- 查询后排序 order by xxx(排序字段) desc 倒序
select * from users where password like '%1%' order by id desc;
```



##### update

表更新

```sql
-- 报错关闭
SET SQL_SAFE_UPDATES = 0;

-- 更新用户名
update users set realname='你泽哥1' where username='youzege';
```



##### delete

表信息删除

此操作有危险，不加条件会删除表中所有信息！

```sql
-- 删除
delete from users where username='youzege';
```



注意，如果需要删除数据，我们需要给表改造一下，添加state字段，默认1，用来判断删除。

软删除，不是真正的删除，安全，可以恢复数据

```sql
-- 删除一条信息，直接改state状态 1未删除，0删除
update users set state='0';

-- 查询 state = 1
select * from users where state='1';
```



#### NodeJS操作 MySQL数据库

通过一个demo来完成，跑通流程

安装 mysql 包

```
npm install mysql
```



创建index.js

```js
import mysql from 'mysql'

// 创建链接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'nodeblog'
})

// 开始连接数据库
con.connect()

// 执行sql语句
const sql = 'select * from users;'
// const sql = `update users set realname='你泽哥1' where username='youzege';`
// const sql = `insert into users (username, `password`, realname) values ('lizehang', '123', '李泽航');`

//查询
con.query(sql, (err, result) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(result)
})

// 关闭连接
con.end()

```



**执行更新返回的参数**

affectedRows: 1 表示影响的行数是一行

changedRows: 1 表示更新的行数是一行



**执行插入返回的参数**

insertId: 3 表示新插入的id



如果连接报错 请查阅 [解决Navicat连接不上MySql服务器报错：Client does not support authentication protocol requested by server； conside_小李睡醒了的博客-CSDN博客_navicat连接不到服务器](https://blog.csdn.net/weixin_43111077/article/details/108811949)

```sql
-- 步骤1：
ALTER USER 'root'@'localhost' IDENTIFIED BY '12345678' PASSWORD EXPIRE NEVER;

-- 步骤2：
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';

-- 步骤3：
FLUSH PRIVILEGES; 
```

