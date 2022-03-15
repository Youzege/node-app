import { getList, getDetail } from './../controller/blog.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'

const handleBlogRouter = (req, res) => {
    const method = req.method

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        const listData = getList(author, keyword)

        return new SuccessModel(listData)
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const id = req.query.id
        const data = getDetail(id)

        return new SuccessModel(data)
    }

    // 新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        return {
            msg: '新建博客接口~'
        }
    }

    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        return {
            msg: '更新博客接口~'
        }
    }

    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        return {
            msg: '删除博客接口~'
        }
    }
}

export default handleBlogRouter