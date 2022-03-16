import { login } from './../controller/user.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'

// 设置过期时间
const getCookieExpires = () => {
    const date = new Date()
    date.setTime(date.getTime() + ( 24 * 60 * 60 * 1000))
    console.log(date.toGMTString())
    return date.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query

        const result = login(username, password)
        return result.then(loginData => {
            if (loginData.username) {
                //操作 cookie

                res.setHeader('Set-Cookie', `username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`)

                return new SuccessModel()
            }
            return new ErrorModel('登录失败!')
        })
    }
    
    // 登录验证测试
    if (method === 'GET' && req.path === '/api/user/login-test') return req.cookie.username ? Promise.resolve(new SuccessModel(req.cookie.username)) : Promise.resolve(new ErrorModel('尚未登录'))
}

export default handleUserRouter