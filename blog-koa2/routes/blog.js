const router = require('koa-router')()
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('./../controller/blog')
const { SuccessModel, ErrorModel } = require('./../model/resModel')
const loginCheck = require('./../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''
  if (ctx.query.isadmin) {
    // 管理员 界面
    if (ctx.session.username == null) {
      // 未登录
      ctx.body = new ErrorModel('用户未登录')
      return
    }
    // 强制查询自己的博客
    author = ctx.session.username
  }
  const listData = await getList(author, keyword)

  ctx.body = new SuccessModel(listData)
})

router.get('/detail', async (ctx, next) => {
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async (ctx, next) => {
  const body = ctx.request.body
  body.author = ctx.session.username

  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
  console.log(ctx.query)
  const data = await updateBlog(ctx.query.id, ctx.request.body)

  data ? ctx.body = new SuccessModel() : ctx.body = new ErrorModel('更新博客失败!')
})

router.post('/del', loginCheck, async (ctx, next) => {
  const author = ctx.session.username
  const data = await delBlog(ctx.query.id, author)

  data ? ctx.body = new SuccessModel() : ctx.body = new ErrorModel('删除博客失败!')
})

module.exports = router
