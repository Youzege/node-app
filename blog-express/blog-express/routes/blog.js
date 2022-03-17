const express = require('express')
const router = express.Router()


router.get('/list', function (req, res, next) {
  res.json({
    errno: 0,
    data: [1, 2, 3]
  })
})

router.get('/detail', function (req, res, next) {
    res.json({
      errno: 0,
      data: [2, 3, 4]
    })
  })

module.exports = router
