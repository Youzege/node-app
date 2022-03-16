import { login } from './../controller/user.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'



const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query

        const result = login(username, password)
        return result.then(loginData => {
            if (loginData.username) {
                // 设置 sessino
                req.session.username = loginData.username
                req.session.realname = loginData.realname

                return new SuccessModel()
            }
            return new ErrorModel('登录失败!')
        })
    }
    
    // 登录验证测试
    if (method === 'GET' && req.path === '/api/user/login-test') return req.session.username ? Promise.resolve(new SuccessModel(req.session.username)) : Promise.resolve(new ErrorModel('尚未登录'))
}

export default handleUserRouter