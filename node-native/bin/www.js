import http from 'http'
import serverHandle from '../app.js'

const PORT = 8000

// 将app的node实例 作为服务创建
// const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT)
console.log('服务器启动 -- http://localhost:8000/')