import { loginCheck } from './../controller/user.js'
import { SuccessModel, ErrorModel } from './../model/resModel.js'

const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body

        const result = loginCheck(username, password)
        return result.then(loginData => loginData.username ? new SuccessModel() : new ErrorModel('登录失败!'))
    }
}

export default handleUserRouter