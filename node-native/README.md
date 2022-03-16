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

##### 处理返回数据 responseModel

新建src/model目录，创建`resModel.js`，用来处理服务端给客户端返回的数据格式

例如：下面的JSON

```json
{
    "data": [
        {
            "id": 1,
            "title": "标题A",
            "content": "内容A",
            "createTime": 1647340327044,
            "author": "youzege"
        },
        {
            "id": 2,
            "title": "标题B",
            "content": "内容B",
            "createTime": 1647340361996,
            "author": "youzege"
        }
    ],
    "message": "成功返回",
    "errno": 0
}
```

`resModel`实现

成功返回 & 失败返回 两个类

```js

class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}

/**
 * 请求成功 返回的信息
 * @param data
 * @param message
 * @returns errno 0
 */
class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

/**
 * 请求失败 返回的信息
 * @param data
 * @param message
 * @returns errno -1
 */
class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

export {
    SuccessModel,
    ErrorModel
}
```



##### 处理服务端返回数据

创建src/controller目录，定义blog.js，用来处理接口请求服务端需要返回的数据，只返回数据，不做其他处理

例如：获取用户博客列表，创建`getList`方法

```js
/**
 * 
 * @param {*} author 作者
 * @param {*} keyword 关键字
 * @returns blog list 博客数组
 */
const getList = (author, keyword) => {
    
    return [
        {
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 1647340327044,
            author: 'youzege'
        },
        {
            id: 2,
            title: '标题B',
            content: '内容B',
            createTime: 1647340361996,
            author: 'youzege'
        },
    ]
}

export {
    getList
}
```



##### 处理接口

在src/router/blog.js中，处理获取博客列表的接口，返回正确的数据

```js
import { getList } from './../controller/blog.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'

const handleBlogRouter = (req, res) => {
    ...
     // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        const listData = getList(author, keyword)

        return new SuccessModel(listData)
    }
    ...
}
```



##### 处理app实例

在 app.js中，处理请求query，拿到客户端请求的 `query参数`

```js
import querystring from 'querystring'

const serverHandle = (req, res) => {
    ...
    // 解析 query
    req.query = querystring.parse(url.split('?')[0])
    ...
}
```



结语：给各个模块拆分，单独处理，解耦，易于管理代码模块



#### 路由开发 - 博客详情路由



##### 处理服务端返回的数据

src/controller/blog.js

```js
/**
 * 
 * @param {*} id 
 * @returns 根据 id 返回博客详情信息
 */
const getDetail = (id) => {

    return {
        id: 1,
        title: '标题A',
        content: '内容A',
        createTime: 1647340327044,
        author: 'youzege'
    }
}

export {
    ...
    getDetail
}
```



##### 处理接口

src/router/blog.js

```js
const handleBlogRouter = (req, res) => {
    ...
    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const id = req.query.id
        const data = getDetail(id)

        return new SuccessModel(data)
    }
    ...
}
```



#### post请求参数处理

##### getPostData方法

通过promise异步操作，进行post data的处理

判断是否是 post 请求，否，直接返回空对象

判断请求头，是否为 application/json，否，返回空对象

处理post请求，获取请求参数chunk流，拼接请求参数，数据获取完成，返回resolve成功状态，JSON解析 postData

```js
/**
 * 处理Post请求的数据
 * @param {*} req 
 * @returns promise
 */
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }

        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''

        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve( JSON.parse(postData) )
        })
    })
    return promise
}
```

##### 使用getPostData方法

在promise.then中处理 路由

```js
...
const serverHandle = (req, res) => {
    ...
     // 处理Post data
    getPostData(req).then(postData => {
        req.body = postData

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
    })
}
```



#### 路由开发 - 新建博客路由

##### 处理客户端传递的内容数据

src/controller/blog.js 中，创建newBlog方法

```js
/**
 * 新建博客 参数为博客内容
 * @param {*} blogData 
 * @returns 
 */
const newBlog = (blogData = {}) => {

    return {
        id: 3
    }
}

export {
    ...
    newBlog
}
```

##### 处理接口

```js
import { ... newBlog } from './../controller/blog.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'

const handleBlogRouter = (req, res) => {
    ...
    // 新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const data = newBlog(req.body)

        return new SuccessModel(data)
    }
    ...
}
```

接口返回示例

```json
{
    "data": {
        "id": 3
    },
    "errno": 0
}
```



#### 路由开发 - 更新博客路由

##### 处理客户端传递的更新数据和id

src/controller/blog.js 中，创建updateBlog方法

```js
/**
 * 更新博客
 * @param {*} id id更新博客的ID
 * @param {*} blogData 更新博客的内容
 * @returns 
 */
 const updateBlog = (id, blogData = {}) => {

    console.log(id, blogData);
    return true
}
 
 export {
    ...
    updateBlog
}
```

##### 处理接口

```js
import { ... updateBlog } from './../controller/blog.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'

const handleBlogRouter = (req, res) => {
    ...
    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const result = updateBlog(id, req.body)

        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel('更新博客失败!')
        }
    }
    ...
}
```

请求示例

```json
{
    "errno": 0
}
//----------------------
{
    "message": "更新博客失败!",
    "errno": -1
}
```



#### 路由开发 - 删除博客路由

##### 处理客户端传递的删除的博客id

src/controller/blog.js 中，创建delBlog方法

```js
/**
 * 更新博客
 * @param {*} id id更新博客的ID
 * @returns 
 */
 const delBlog = (id, blogData = {}) => {

    return true
}
 
 export {
    ...
    delBlog
}
```

##### 处理接口

```js
import { ... delBlog } from './../controller/blog.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'

const handleBlogRouter = (req, res) => {
    ...
    // 删除博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const result = delBlog(id, req.body)

        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel('删除博客失败!')
        }
    }
    ...
}
```

请求示例

```json
{
    "errno": 0
}
//----------------------
{
    "message": "删除博客失败!",
    "errno": -1
}
```



#### 路由开发 - 用户登录

##### 处理登录判断

src/controller/user.js 中，创建loginCheck方法

```js
const loginCheck = (username, password) => {

    if (username === 'youzege' && password === '123') {
        return true
    }

    return false
}

export {
    loginCheck
}
```

##### 处理登录接口

```js
import { loginCheck } from './../controller/user.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'

const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body

        const result = loginCheck(username, password)

        if (result) {
            return new SuccessModel()
        }
        return new ErrorModel('登录失败!')
    }
}

export default handleUserRouter
```

返回示例

```json
// 成功
{
    "errno": 0
}
// 失败
{
    "message": "登录失败!",
    "errno": -1
}
```



#### Node.js 连接 MySQL数据库



安装mysql `npm install mysql`



##### 设置环境变量

新建src/conf/db.js，设置环境变量

```js
const env = process.env.NODE_ENV // 环境变量

// 配置
let MYSQL_CONF

if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'nodeblog'
    }
}

if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'nodeblog'
    }
}

export default MYSQL_CONF

```



##### 启动连接mysql数据库

新建src/db/mysql.js

```js
import mysql from 'mysql'
import MYSQL_CONF from './../conf/db.js'

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

/**
 * 统一执行sql的函数
 * @param {*} sql 
 */
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

export default exec

```



#### 数据库接口 - 获取博客列表

##### 处理数据

```js
const getList = (author, keyword) => {
    // 1=1 作用 占位符，防止 author keyword值没有导致报错
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回的是promise
    return exec(sql)
}
```

##### 处理接口

getList返回了一个promise对象，需要进行处理

```js
const handleBlogRouter = (req, res) => {
    ...
    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''

        const result = getList(author, keyword)
        
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }
    ...
}
```

##### 处理app实例

现在通过 返回 promise对象来进行数据获取，修改获取数据的方式，通过promise.then

```js
const serverHandle = (req, res) => {
    ...
    getPostData(req).then(postData => {
        ...
        /**
         * 博客数据 & 路由
         */ 
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                res.end( JSON.stringify(blogData) )
            })
            return
        }
        ...
    }
}
```



#### 数据库接口 - 获取博客详情

##### 处理数据

```js
const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`

    return exec(sql).then(rows => rows[0])
}
```

##### 处理接口

```js
const handleBlogRouter = (req, res) => {
    ...
    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id)

        return result.then(data => new SuccessModel(data))
    }
    ...
}
```



#### 数据库接口 - 新建博客

##### 处理数据

目前没有前台，都是假数据

```js
const newBlog = (blogData = {}) => {
    // 获取博客对象
    const { title, content, author } = blogData
    const createtime = Date.now()
    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', '${createtime}', '${author}');
    `

    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}
```

##### 处理接口

```js
const handleBlogRouter = (req, res) => {
    ...
    // 新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        req.body.author = 'youzege'
        const result = newBlog(req.body)

        return result.then(data => new SuccessModel(data))
    }
    ...
}
```

#### 数据库接口 - 更新博客

##### 处理数据

```js
/**
 * 更新博客
 * @param {*} id id更新博客的ID
 * @param {*} blogData 更新博客的内容
 * @returns 
 */
 const updateBlog = (id, blogData = {}) => {
    const { title, content } = blogData

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `

    return exec(sql).then(updateData => updateData.affectedRows > 0 ? true : false)
}
```



##### 数据接口

```js
const handleBlogRouter = (req, res) => {
    ...
    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const result = updateBlog(id, req.body)

        return result.then(updateData => updateData ?  new SuccessModel() : new ErrorModel('更新博客失败!'))
    }
    ...
}
```



#### 数据库接口 - 删除博客

##### 处理数据

目前没有做软删除，而是直接删除

```js
/**
 * 删除博客
 * @param {*} id id删除博客的ID
 * @returns 
 */
 const delBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}';`

    return exec(sql).then(delData => delData.affectedRows > 0 ? true : false)
}
```

##### 数据接口

```
const handleBlogRouter = (req, res) => {
    ...
    // 删除博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const author = 'youzege'
        const result = delBlog(id, author)

        return result.then(delData => delData ? new SuccessModel() : new ErrorModel('删除博客失败!'))
    }
    ...
}
```



#### 数据库接口 - 用户登录

##### 处理SQL

```js
const loginCheck = (username, password) => {
    console.log(password);
    const sql = `
        select username, realname from users where username='${username}' and password='${password}';
    `
    return exec(sql).then(rows => rows[0] || {})
}
```

##### 登录接口

```js
const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body

        const result = loginCheck(username, password)
        return result.then(loginData => loginData.username ? new SuccessModel() : new ErrorModel('登录失败!'))
    }
}
```

##### app实例

```js
/**
 * 用户数据 & 路由
 */ 
const userResult = handleUserRouter(req, res)
if(userResult) {
    userResult.then(userData => {
        res.end( JSON.stringify(userData) )
    })
    return
}
```



## 登录功能需要的一些知识



## Cookie

- 什么是cookie
- JavaScript操作 cookie，浏览器中查看 cookie
- server端操作 cookie

**cookie**

- 存储在浏览器的一段字符串 （最大5kb）
- 跨域不共享，浏览器为每个域名存储一段cookie
- 格式：键值对，`k1=v1;k2=v2;k3=v3...`，因此可以存储结构化数据
- 每次发送http请求，会将请求域的cookie一起发送给server端
- server 端 可以修改cookie并返回给浏览器
- 客户端操作cookie，限制浏览器端修改cookie



JavaScript 操作cookie

不能删除，能累加，覆盖

```js
document.cookie = 'k1=100;'
document.cookie = 'k2=200;'
// 'k1=100;k2=200'
document.cookie = 'k1=300;'
// 'k2=200;k1=300'
```



#### cookie 用于登录验证

在 app.js中 ，设置一个解析cookie的工具函数

```js
// 解析cookie
req.cookie = {}
const cookieStr = req.headers.cookie || ''
cookieStr.split(';').forEach(item => {
    if (!item) {
        return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
})
```



#### cookie 测试

##### 阻止客户端操作cookie

在router/user.js中操作cookie，跑通流程，并限制客户端操作 cookie

`res.setHeader('Set-Cookie', username=${username}; path=/; httpOnly)`

httpOnly 阻止客户端操作cookie

```js
const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query

        const result = login(username, password)
        return result.then(loginData => {
            if (loginData.username) {
                //操作 cookie

                res.setHeader('Set-Cookie', `username=${username}; path=/; httpOnly`)

                return new SuccessModel()
            }
            return new ErrorModel('登录失败!')
        })
    }
    
    // 登录验证测试
    if (method === 'GET' && req.path === '/api/user/login-test') return req.cookie.username ? Promise.resolve(new SuccessModel(req.cookie.username)) : Promise.resolve(new ErrorModel('尚未登录'))
}
```

##### 设置cookie过期时间

函数

```js
// 设置过期时间
const getCookieExpires = () => {
    const date = new Date()
    date.setTime(date.getTime() + ( 24 * 60 * 60 * 1000))
    console.log(date.toGMTString())
    return date.toGMTString()
}

res.setHeader('Set-Cookie', `username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`)
```



## Session



不能在 cookie 中存放一些个人信息，隐私等

通过在 cookie 中 存储 userid，server端 对应 username，来解决个人信息暴露的问题 



#### 解析 session

app.js中 解析

```js
// session 数据
const SESSION_DATA = {}

// 解析 session
let needSetCookie = false
let userId = req.cookie.userid
if (userId) {
    if(!SESSION_DATA[userId]) {
        SESSION_DATA[userId] = {}
    }
} else {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
}
req.session = SESSION_DATA[userId]

/**
* 博客数据 & 路由
*/ 
const blogResult = handleBlogRouter(req, res)
if (blogResult) {
blogResult.then(blogData => {
    if (needSetCookie) {
        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
    }
    res.end( JSON.stringify(blogData) )
})
return
}

/**
* 用户数据 & 路由
*/ 
const userResult = handleUserRouter(req, res)
if(userResult) {
userResult.then(userData => {
    if (needSetCookie) {
        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
    }
    res.end( JSON.stringify(userData) )
})
return
}
```



登录路由中，设置 session

```js
// 登录
if (method === 'GET' && req.path === '/api/user/login') {
    // const { username, password } = req.body
    const { username, password } = req.query

    const result = login(username, password)
    return result.then(loginData => {
        if (loginData.username) {
            // 设置 sessino
            req.session.username = loginData.username
            req.session.realname = loginData.realname

            return new SuccessModel()
        }
        return new ErrorModel('登录失败!')
    })
}
```



##### session的一些问题

- 目前session直接存放 js 变量中，放在nodejs进程内存中
- 进程内存有限，访问量过大，内存暴增的问题
- 上线后，运行是多进程的，进程之间内存无法共享的问题



## redis



解决seesion的一些问题

- web server常用的缓存数据库，数据存放在内存中
- 相比于mysql，访问速度快（内存和硬盘不是一个数量级的
- 成本较高，内存贵，存储量小

session适合用 redis

- session 访问频繁，对性能要求极高
- session 可以不考虑断电丢失数据的问题，丢失后，再次登录即可
- session 数据量不会很大

网站数据不适合 redis

- 操作频率不是很高（相较于 session
- 断电不能丢失，必须保留数据
- 数据量过大，内存成本较高



#### redis操作

启动redis服务 `redis-server.exe redis.windows.conf` ，不用关闭窗口

新建窗口：

使用redis服务 `redis-cli.exe -h 127.0.0.1 -p 6379`

设置 键值对： `set myKey abc`

读取 键值对： `get myKey`

查看 所有键： `kyes *`

删除 键值对： `del myKey`



#### 封装redis工具函数

##### 配置redis

src/conf

```js
const env = process.env.NODE_ENV // 环境变量

// 配置
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
    ...
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {
    ...
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

export  {
    ...
    REDIS_CONF
}

```



##### 封装成工具函数

src/db/redis.js

```js
import redis from 'redis'
import { REDIS_CONF } from './../conf/db.js'

// 创建 redis 客户端
const redisClient = redis.createClient(...REDIS_CONF)

redisClient.on('error', err => {
    console.log(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }

            try {
                resolve( JSON.parse(val) )
            } catch (error) {
                resolve(val)
            }
        })
    })
    return promise
}

export {
    set,
    get
}
```



## redis - 用户登录

#### 使用redis同步 session

```js
const serverHandle = (req, res) => {
    ...
    // 解析 session 使用redis
    let needSetCookie = false
    let userId = req.cookie.userid
    // set操作
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 session 值
        set(userId, {})
    }
    // get操作
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            req.session = sessionData
        }
        
        // 处理 post data
        return getPostData(req)
    })
    .then(postData => {
       ...
    })
}
```

#### 路由解析- redis同步

```js
import { set } from './../db/redis.js'

// 登录
if (method === 'GET' && req.path === '/api/user/login') {
    // const { username, password } = req.body
    const { username, password } = req.query

    const result = login(username, password)
    return result.then(loginData => {
        if (loginData.username) {
            // 设置 sessino
            req.session.username = loginData.username
            req.session.realname = loginData.realname

            // 同步 reids
            set(req.sessionId, req.session)

            return new SuccessModel()
        }
        return new ErrorModel('登录失败!')
    })
}
```



## 登录验证



可以做一个中间件来管理需要验证的路由

```js
// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve( new ErrorModel('尚未登录！') )
    }
}
```



新建博客路由、更新博客路由、删除博客路由需要登录验证

```js
// 新建博客
if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
        return loginCheck
    }

    req.body.author = req.session.username
    const result = newBlog(req.body)

    return result.then(data => new SuccessModel(data))
}

// 更新博客
if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
        return loginCheck
    }

    const result = updateBlog(id, req.body)

    return result.then(updateData => updateData.username ?  new SuccessModel() : new ErrorModel('更新博客失败!'))
}

// 删除博客
if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
        return loginCheck
    }

    const author = req.session.username
    const result = delBlog(id, author)

    return result.then(delData => delData ? new SuccessModel() : new ErrorModel('删除博客失败!'))
}
```



## 模拟前后端联调



- 登录功能依赖 cookie， 必须用浏览器来联调
- cookie 跨域不共享，前端和 server端必须同域
- 使用nginx做代理，让前后端同域



#### nginx

- 高性能的web服务器，开源免费
- 常用于做静态服务
- 反向代理



##### nginx 配置

代理 前端 8001 后端 8000 端口

```
location / {
    proxy_pass http://localhost:8001;
}	
location /api/ {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
}	
```
