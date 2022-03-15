const handleBlogRouter = (req, res) => {
    const method = req.method

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        return {
            msg: '获取博客列表接口~'
        }
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        return {
            msg: '获取博客详情接口~'
        }
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