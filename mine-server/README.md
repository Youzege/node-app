## Mine-Server 服务端接口



### 接口列表

| 接口名称 | 请求方法 | 请求URL         | 请求参数     | 描述                  |
| -------- | -------- | --------------- | :----------- | --------------------- |
| 登录     | POST     | /api/user/login | 用户名，密码 | 单点登录，token信息等 |
|          |          |                 |              |                       |
|          |          |                 |              |                       |



### 日志插件

**log4js-node**



**安装**

```
npm install log4js
```



**封装成一个通用的日志处理插件**

`utils/log4j.js`



**1. 引入插件**

```js
 const log4js = require('log4js')
```



**2. 定义日志输出等级**

根据不同颜色来区分重要程度

```js
const levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
}
```



**3. log4js配置**



```js
log4js.configure({
    appenders: {...},
    categories: {...}
})
```



**追加器：appenders**

打印方式：console

info & error，两种等级的日志输出位置，输出类型

```js
appenders: {
    console: { type: 'console' },
    info: {
      type: 'file',
      filename: 'logs/all-logs.log'
    },
    error: {
      type: 'dateFile',
      filename: 'logs/log',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true //设置文件名称 filename + pattern
    }
}
```

**种类：categories**

appenders：还有其他类型的输出方式

level：输出日志等级

```js
categories: {
    default: { appenders: ['console'], level: 'debug' },
    info: { appenders: ['info', 'console'], level: 'info' },
    error: { appenders: ['error', 'console'], level: 'error' }
}
```



**导出日志函数**

```js
/**
 * 日志输出，level为debug
 * @param {string} content
 */
const debug = content => {
  let logger = log4js.getLogger()
  logger.level = levels.debug
  logger.debug(content)
}

/**
 * 日志输出，level为info
 * @param {string} content
 */
const info = content => {
  let logger = log4js.getLogger('info')
  logger.level = levels.info
  logger.info(content)
}

/**
 * 日志输出，level为error
 * @param {string} content
 */
const error = content => {
  let logger = log4js.getLogger('error')
  logger.level = levels.error
  logger.error(content)
}

module.exports = {
  debug,
  info,
  error
}
```



**使用日志插件**

数据返回模型

utils/resModel.js

```js
const { info, debug, error } = require('./log4j')
const { CODE } = require('./utils')

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
        this.code = CODE.SUCCESS
        if(data) {
            debug(data)
        } else {
            debug(message)
        }
    }
}

/**
 * 请求失败返回的信息
 * @param data
 * @param message
 * @returns errno -1
 */
class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.code = CODE.BUSINESS_ERROR
        if(data) {
            error(data)
        } else {
            error(message)
        }
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
```



### **ORM: sequelize**

Sequelize 是一个基于 promise 的 Node.js [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping), 目前支持 [Postgres](https://en.wikipedia.org/wiki/PostgreSQL), [MySQL](https://en.wikipedia.org/wiki/MySQL), [MariaDB](https://en.wikipedia.org/wiki/MariaDB), [SQLite](https://en.wikipedia.org/wiki/SQLite) 以及 [Microsoft SQL Server](https://en.wikipedia.org/wiki/Microsoft_SQL_Server). 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。



**安装插件**

```
npm i sequelize

npm i mysql2
```



**连接到数据库**

[`sequelize.sync()`](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-sync)

```js
const { info, error } = require('../utils/log4j')
const {
  database,
  host,
  port,
  user,
  password
} = require('../config/db').MYSQL_CONF

const Sequelize = require('sequelize')

const sequelize = new Sequelize(database, user, password, {
  port,
  host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    // 字符集
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  timezone: '+08:00' //时区转换
});

(async () => {
  try {
    await sequelize.authenticate()
    info(`****数据库连接成功****`)
  } catch (error) {
      error(`****数据库连接失败**** ${error}`)
  }
})()

sequelize.sync()

module.exports = sequelize

```



#### 模型基础

模型是 Sequelize 的本质. 模型是代表数据库中表的抽象. 在 Sequelize 中,它是一个 [Model](https://sequelize.org/master/class/lib/model.js~Model.html) 的扩展类.

该模型告诉 Sequelize 有关它代表的实体的几件事,例如数据库中表的名称以及它具有的列(及其数据类型).



**基本使用**

定义一个User 模型，代表着我们的数据库中用户表

**基本数据**
primaryKey：设置主键

type：数据类型

autoIncrement: 自增

allowNull：允许为Null ？

unique：唯一值

timestamps：时间戳，boolean

```js
const { DataTypes } = require('sequelize')
const sequelize = require('../db/sequelize')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    realname: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)


module.exports = User

```



**简单 INSERT 查询**

在路由中，模拟一个注册，insert插入

findOrCreate：查找一个参数，会返回一个查找实例(有则返回，无则创建)，一个布尔值，true为参数不存在，false为参数存在

```js
router.post('/register', async (ctx, next) => {
  const { username, password, realname } = ctx.request.body

  const [ user , created ] = await User.findOrCreate({ 
    where: { username },
    defaults: { username, password, realname }
  });

  created ? ctx.body = new SuccessModel('创建用户成功!') : ctx.body = new ErrorModel('用户名已存在！')
})
```



**简单的登录路由**

findOne查找用户名和密码，并返回用户名和真实名称，使用jsonwebtoken, koa-jwt插件，用来保证登录信息安全，返回加密后的登录信息字符串，之后会通过token在服务端进行签名的解密。

```js
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const result = await User.findOne({
    attributes: ['username', 'realname'],
    where: {
      username,
      password
    }
  })
  const data = result.dataValues
  const token = jwt.sign({
    data: data
  }, 'youzege', { expiresIn: '24h'})
  result === null ? ctx.body = new ErrorModel('账号或密码不正确') : ctx.body = new SuccessModel({...data, token})
})
```

```
const token = jwt.sign({
    data: data
  }, 'youzege', { expiresIn: '24h'})
```

jwt插件配置：大概3个

```
jwt.sign({ data: '你的用户数据'}, 'secret 密钥', { 可以设置过期时间等。。。 })
```

**模拟解密**

```js
router.get('/login-test', (ctx, next) => {

  const authorization = ctx.request.headers.authorization
  
  const payload = decoded(authorization)
  
  ctx.body = payload
})
```

app.js中进行路由鉴权

```js
const koajwt = require('koa-jwt')
const { info } = require('./utils/log4j')
const { CODE } = require('./utils/utils')
const { ErrorModel } = require('./utils/resModel')

// token验证失败返回的日志
app.use(async (ctx, next) => {
  const method = ctx.request.method
  if (method === 'GET') {
    info(`get params:${JSON.stringify(ctx.request.query)}`)
  } else {
    info(`post params:${JSON.stringify(ctx.request.body)}`)
  }

  await next().catch(err => {
    console.log(err.name)
    if (err.status == '401') {
      ctx.status = 200
      ctx.body = new ErrorModel('Token认证失败', CODE.AUTH_ERROR)
    } else {
      ctx.body = new ErrorModel('Token认证失败', CODE.AUTH_ERROR)
    }
  })
})

// 跳过login路由，验证其他所有路由中的token，过期则报错
app.use(
  koajwt({ secret: 'youzege' }).unless({
    path: [/^\/api\/user\/login/]
  })
)
```





### json-web-token



JWT是一种跨域**认证**解决方案

解决的问题

- 数据传输简单，高效
- jwt会生成签名，保证传输安全
- jwt具有时效性
- jwt更高效利用集群做好单点登录



**基本原理**

- 服务端认证后，生成一个JSON对象，后续通过json进行通信



**数据结构**

- Header 头
- Payload 负载
- Signature 签名



Header结构

```
{
	"alg": "HS256", // 加密算法
	"typ": "jwt" // 加密类型
}
```

Payload结构 （大概把用户信息载入即可

- iss (issuer) 签发人
- exp (expiration time) 过期时间
- sub (subject) 主题
- aud (audience) 受众
- nbf (Not Before) 生效时间
- iat (Issued At) 签发时间
- jti (JWT ID) 编号

```js
{
    "sub": "123456789",
    "name": "youzege",
    "admin": true
}
```

Signature 签名....



**请求方式**

storage写入token

请求头 Authorization:Bearze <token>