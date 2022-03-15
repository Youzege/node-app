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



#### 路由设计|初始化路由

在根目录下创建src目录，用来处理一些业务

src目录下，新建 router 文件夹，用来保存路由信息

##### 博客路由

创建src/blog.js , 处理请求的路由地址

```js
const handleBlogRouter = (req, res) => {
    const method = req.method

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        return {
            msg: '获取博客列表接口~'
        }
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        return {
            msg: '获取博客详情接口~'
        }
    }

    // 新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        return {
            msg: '新建博客接口~'
        }
    }

    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        return {
            msg: '更新博客接口~'
        }
    }

    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        return {
            msg: '删除博客接口~'
        }
    }
}

export default handleBlogRouter
```



##### 用户路由

创建src/user.js , 处理 用户路由

```js
const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        return {
            msg: '登录接口~'
        }
    }
}

export default handleUserRouter
```



##### app实例加载路由

```js
import  { handleBlogRouter, handleUserRouter }  from './src/router/index.js'

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取path
    const url = req.url
    req.path = url.split('?')[0]

    /**
     * 博客数据 & 路由
     */ 
    const blogData = handleBlogRouter(req, res)
    if(blogData) {
        res.end( JSON.stringify(blogData) )
        return
    }

    /**
     * 用户数据 & 路由
     */ 
     const userData = handleUserRouter(req, res)
     if(userData) {
         res.end( JSON.stringify(userData) )
         return
     }

     /**
      * 未命中路由，返回404
      * text/plain 纯文本
      */
     res.writeHead(404, { 'Content-type': 'text/plain' })
     res.write('404 Not Found\n')

     res.end()
}

export default serverHandle
```



##### 在node中使用ESM的办法

在package.json中配置

```js
{
	"type": "module",
}
```



**结语**：这是Node创建路由的一些简单基本应用，主要是创建路由，在`app.js`入口中引入路由处理函数，完成http请求的过程。



#### 路由开发 - 博客列表路由