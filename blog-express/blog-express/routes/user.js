const express = require('express')
const router = express.Router()
const  { login }  = require('./../controller/user')
const { SuccessModel, ErrorModel } = require('./../model/resModel')


router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  const result = login(username, password)

  return result.then(loginData => {
      if (loginData.username) {
          // 设置 sessino
          req.session.username = loginData.username
          req.session.realname = loginData.realname

          res.json( new SuccessModel() )
          return
      }
      res.json( new ErrorModel('登录失败!') ) 
  })
})

router.get('/login-test', (req, res, next) => {
  if (req.session.username) {
    res.json( { session: req.session.username} )
    return
  }
  res.json( { erron: -1 })
})

module.exports = router
