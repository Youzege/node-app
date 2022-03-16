import querystring from 'querystring'
import  { handleBlogRouter, handleUserRouter }  from './src/router/index.js'
import { get, set } from './src/db/redis.js'
import { access } from './src/utils/log.js'
import useReadLine from './src/utils/readline.js'

// 设置过期时间
const getCookieExpires = () => {
    const date = new Date()
    date.setTime(date.getTime() + ( 24 * 60 * 60 * 1000))
    return date.toGMTString()
}

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
    // 记录 access log 日志
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    useReadLine()

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
    
    // 解析 session 使用redis
    let needSetCookie = false
    let userId = req.cookie.userid
    // set操作
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 session 值
        set(userId, {})
    }
    // get操作
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            req.session = sessionData
        }
        
        // 处理 post data
        return getPostData(req)
    })
    .then(postData => {
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