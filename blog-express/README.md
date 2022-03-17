## express 框架



开发流

- express下载、安装和使用，express中间件机制
- 开发接口、连接数据库、实现登录、日志记录
- 分析express中间件原理



#### express安装

##### express-generator脚手架

安装脚手架：`npm install express-generator -g`

使用脚手架：express '项目名称'

安装一些插件：nodemon、cross-env



#### express app.js入口代码

脚手架给我们创建的一些插件



`express`插件：框架实例



`createError`插件：处理404错误。

```js
const createError = require('http-errors');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
```



`cookieParser`插件：处理cookie的插件

```js
app.use(cookieParser());
```



`morgan`插件：日志处理

```js
const logger = require('morgan');

app.use(logger('dev'));
```



#### express 路由

##### GET请求

在 routes文件夹 中新建，blog.js 文件

```js
const express = require('express')
const router = express.Router()


router.get('/list', function (req, res, next) {
  res.json({
    errno: 0,
    data: [1, 2, 3]
  })
})

module.exports = router
```

`res.json`，让我们可以返回json格式的数据，框架给json封装了请求头为 json格式，非常方便



在 app.js 中引入 blog.js

```js
const blogRouter = require('./routes/blog')

app.use('/api/blog', blogRouter)
```

访问 `localhost:3000/api/blog/list`

让接口api 拆分更明确，父路由子路由分离，能更少的修改文件



##### POST请求

在 routes文件夹 中新建，user.js 文件

```js
const express = require('express')
const router = express.Router()

/* GET home page. */
router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  res.json({
    errno: 0,
    data: { username, password }
  })
})

module.exports = router
```

`app.use(express.json())`，express框架的方法，为我们处理号了body中的post数据，在post请求中直接访问，req.body就能拿到数据。非常舒服

在 app.js 中引入 user.js

```js
const userRouter = require('./routes/user')

app.use('/api/user', userRouter)
```

访问请求 在Apifox中进行post调试  `localhost:3000/api/user/login`



express提供了其他的解析方式，比如解析urlencoded

```js
app.use(express.urlencoded({ extended: false }))
```

