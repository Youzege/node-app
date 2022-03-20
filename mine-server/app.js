const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koajwt = require('koa-jwt')
const { info } = require('./utils/log4j')
const { CODE } = require('./utils/utils')
const { ErrorModel } = require('./utils/resModel')
const log4js = require('./utils/log4j')

const user = require('./routes/user')

// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())

// logger
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

app.use(
  koajwt({ secret: 'youzege' }).unless({
    path: [/^\/api\/user\/login/]
  })
)


// routes
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err}`)
})

module.exports = app
