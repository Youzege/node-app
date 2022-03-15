import querystring from 'querystring'
import  { handleBlogRouter, handleUserRouter }  from './src/router/index.js'

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystring.parse(url.split('?')[0])

    /**
     * 博客数据 & 路由
     */ 
    const blogData = handleBlogRouter(req, res)
    if(blogData) {
        res.end( JSON.stringify(blogData) )
        return
    }

    /**
     * 用户数据 & 路由
     */ 
     const userData = handleUserRouter(req, res)
     if(userData) {
         res.end( JSON.stringify(userData) )
         return
     }

     /**
      * 未命中路由，返回404
      * text/plain 纯文本
      */
     res.writeHead(404, { 'Content-type': 'text/plain' })
     res.write('404 Not Found\n')

     res.end()
}

export default serverHandle