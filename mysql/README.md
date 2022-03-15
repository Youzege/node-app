## 🐰MySQL 数据库



用户：root

密码：123456



可视化工具：beekeeper Studio





#### 📦操作数据库SQL基础

- 建库
- 建表
- 表操作 SQL语句



#### 建库操作

```sql
CREATE SCHEMA `nodeblog`
```



#### 建表

##### 用户信息表

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `realname` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息表'
```

