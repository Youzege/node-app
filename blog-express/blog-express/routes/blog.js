const express = require('express')
const router = express.Router()
const { getList, getDetail } = require('./../controller/blog')
const { SuccessModel, ErrorModel } = require('./../model/resModel')

router.get('/list', function (req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''
  if (req.query.isadmin) {
      // 管理员 界面
      if (req.session.username == null) {
          // 未登录
          res.json( new ErrorModel('用户未登录') )
          return 
      }
      // 强制查询自己的博客
      author = req.session.username
  }

  const result = getList(author, keyword)
  
  result.then(listData => res.json( new SuccessModel(listData) ))
})

router.get('/detail', function (req, res, next) {
    const result = getDetail(req.query.id)
    result.then(data => res.json( new SuccessModel(data)) )
  })

module.exports = router
