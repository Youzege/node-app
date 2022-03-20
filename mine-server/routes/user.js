const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const { SuccessModel, ErrorModel } = require('./../utils/resModel')
const { decoded } = require('./../utils/utils')
const User = require('./../model/user')


router.prefix('/api/user')

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

router.post('/register', async (ctx, next) => {
  const { username, password, realname } = ctx.request.body

  const [ user , created ] = await User.findOrCreate({ 
    where: { username },
    defaults: { username, password, realname }
  });

  created ? ctx.body = new SuccessModel('创建用户成功!') : ctx.body = new ErrorModel('用户名已存在！')
})

router.get('/login-test', (ctx, next) => {

  const authorization = ctx.request.headers.authorization
  
  const payload = decoded(authorization)
  
  ctx.body = payload
})

module.exports = router
