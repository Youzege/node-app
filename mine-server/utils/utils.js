const jwt = require('jsonwebtoken')

/**
 * 状态码
 */
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, //参数错误
  USER_ACCOUNT_ERROR: 20001, //账号或密码错误
  USER_LOGIN_ERROR: 30001, //用户未登录
  BUSINESS_ERROR: 40001, //业务请求失败
  AUTH_ERROR: 500001 // 认证失败或TOKEN过期
}

const decoded = (authorization) => {
  if (authorization) {
    let token = authorization.split(' ')[1]

    return jwt.verify(token, 'youzege')
  }
  return ''
}

module.exports = {
    CODE,
    decoded
}