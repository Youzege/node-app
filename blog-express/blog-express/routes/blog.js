const express = require('express')
const router = express.Router()
const { getList } = require('./../controller/blog')
const { SuccessModel } = require('./../model/resModel')


router.get('/list', function (req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  // if (req.query.isadmin) {
  //     // 管理员 界面
  //     const loginCheckResult = loginCheck(req)
  //     if (loginCheckResult) {
  //         // 未登录
  //         return loginCheckResult
  //     }
  //     // 强制查询自己的博客
  //     author = req.session.username
  // }

  const result = getList(author, keyword)
  
  return result.then(listData => res.json( new SuccessModel(listData) ))
})

router.get('/detail', function (req, res, next) {
    res.json({
      errno: 0,
      data: [2, 3, 4]
    })
  })

module.exports = router
