## 原生搭建 后台接口



🐢记录一些学习node的思路，以及node编写接口服务的过程、流程等等...

接口调试工具：`Apifox`，可以部署mock接口、接口调试功能

`nodemon`：自动检测服务更新

`cross-env`：开发环境监听



#### 项目初始化

在不使用框架的情况部署一个后台

`npm init -y` 构建一个package.json 包



#### 创建HTTP服务

node-native文件夹下创建目录 **bin**，用于装载node服务

1. bin/www.js 文件下创建http服务

```js
const http = require('http')

const PORT = 8000

// 将app的node实例 作为服务创建
const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT)
```

2. 根目录下创建app.js文件，用于编写接口实例

```js
const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    const resData = {
        name: 'youzege',
        site: 'gis-se',
        env: process.env.NODE_ENV
    }

    res.end( JSON.stringify(resData) )
}

module.exports = serverHandle
```

将实例导出，加载到www.js中的http服务中

```js
// 将app的node实例 作为服务创建
const serverHandle = require('../app')

const server = http.createServer(serverHandle)
```



#### 接口设计信息

| 描述             | 接口地址         | 请求方法 | url参数                       | 备注                     |
| ---------------- | ---------------- | -------- | ----------------------------- | ------------------------ |
| 获取博客列表     | /api/blog/list   | GET      | author作者，keyword搜索关键字 | 参数为空，不进行查询过滤 |
| 获取一篇博客内容 | /api/blog/detail | GET      | id                            |                          |
| 新增一篇博客     | /api/blog/new    | POST     |                               | post中有新增的信息       |
| 更新一篇博客     | /api/blog/update | POST     | id                            | postData中有更新的内容   |
| 删除一篇博客     | /api/blog/del    | POST     | id                            |                          |
| 登录             | /api/user/login  | POST     |                               | postData中有用户名和密码 |

