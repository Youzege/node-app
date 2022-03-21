const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const { SuccessModel, ErrorModel } = require('./../utils/resModel')
const { decoded } = require('./../utils/utils')
const User = require('./../model/user')
const md5 = require('md5')


router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body

  const result = await User.findOne({
    attributes: ['username', 'realname'],
    where: {
      username,
      password: md5(password)
    }
  })

  if (result !== null) {
    const data = result.dataValues
    const token = jwt.sign({
      data: data
    }, 'youzege', { expiresIn: '24h'})
    ctx.body = new SuccessModel({...data, token})
    return
  }
  ctx.body = new ErrorModel('账号或密码不正确')
})

router.post('/register', async (ctx, next) => {
  const { username, password, realname } = ctx.request.body
  

  const [ user , created ] = await User.findOrCreate({ 
    where: { username },
    defaults: { username, password: md5(password), realname }
  });

  created ? ctx.body = new SuccessModel('创建用户成功!') : ctx.body = new ErrorModel('用户名已存在！')
})

router.get('/login-test', (ctx, next) => {

  const authorization = ctx.request.headers.authorization
  
  const payload = decoded(authorization)
  
  ctx.body = payload
})

module.exports = router
