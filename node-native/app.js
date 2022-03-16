import querystring from 'querystring'
import  { handleBlogRouter, handleUserRouter }  from './src/router/index.js'

// 设置过期时间
const getCookieExpires = () => {
    const date = new Date()
    date.setTime(date.getTime() + ( 24 * 60 * 60 * 1000))
    return date.toGMTString()
}

// session 数据
const SESSION_DATA = {}

/**
 * 处理Post请求的数据
 * @param {*} req 
 * @returns promise
 */
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }

        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''

        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve( JSON.parse(postData) )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    // 解析 session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if(!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    // 处理Post data
    getPostData(req).then(postData => {
        req.body = postData

        /**
         * 博客数据 & 路由
         */ 
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end( JSON.stringify(blogData) )
            })
            return
        }

        /**
         * 用户数据 & 路由
         */ 
        const userResult = handleUserRouter(req, res)
        if(userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end( JSON.stringify(userData) )
            })
            return
        }

        /**
         * 未命中路由，返回404
         * text/plain 纯文本
         */
        res.writeHead(404, { 'Content-type': 'text/plain' })
        res.write('404 Not Found!!!\n')

        
        res.end()
    })
}

export default serverHandle