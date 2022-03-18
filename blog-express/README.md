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



#### express 中间件



中间件的机制，一次请求中，会根据命中的路由，来对请求进行处理

express中的 一个个 app.use，就是中间件，当回调函数中执行next，就会一个个串联，最后处理完成整个请求过程。



```js
const express = require('express')

// 本次 http 请求的实例
const app = express()

app.use((req, res, next) => {
    console.log('请求开始...', req.method, req.url)
    next()
})

app.use((req, res, next) => {
    // 假设在处理 cookie
    req.cookie = {
        userId: 'abc123'
    }
    next()
})

app.use((req, res, next) => {
    // 假设处理 post data
    // 异步
    setTimeout(() => {
        req.body = {
            a: 100,
            b: 200
        }
        next()
    })
})

app.use('/api', (req, res, next) => {
    console.log('处理 /api 路由')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('get /api 路由')
    next()
})
app.post('/api', (req, res, next) => {
    console.log('post /api 路由')
    next()
})

// 模拟登录验证
function loginCheck(req, res, next) {
    setTimeout(() => {
        console.log('模拟登陆失败')
        res.json({
            errno: -1,
            msg: '登录失败'
        })

        // console.log('模拟登陆成功')
        // next()
    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.post('/api/get-post-data', loginCheck, (req, res, next) => {
    console.log('post /api/get-post-data')
    res.json({
        errno: 0,
        data: req.body
    })
})

app.use((req, res, next) => {
    console.log('处理 404')
    res.json({
        errno: -1,
        msg: '404 not fount'
    })
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
```



#### express 登录中间件



##### 将session存储到redis中



db/redis.js

```js
const redis = require('redis')
const { REDIS_CONF } = require('./../conf/db')

// 创建 redis 客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
    console.log(err)
})


module.exports = { redisClient }
```



app.js

使用插件：connect-redis，这是一个函数，将express提供的session插件传入session就可以了。

然后创建RedisStore实例，装载redis客户端，将sessionStore仓库加载到session中间件中即可~

```js
const RedisStore = require('connect-redis')(session)
const { redisClient } = require('./db/redis')

const sessionStore = new RedisStore({ client: redisClient })
// 解析session
app.use(session({ 
  resave: false,
  saveUninitialized: true, 
  secret: 'YZG_3857#', 
  cookie: { path: '/', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, 
  store: sessionStore
}))
```



##### 创建中间件文件夹

middleware文件夹

`logincheck.js` 登录验证

```js
const { ErrorModel } = require('./../model/resModel')

module.exports = (req, res, next) => {
    if (req.session.username) {
        next()
        return
    }
    res.json( new ErrorModel('用户未登录') )
}
```

