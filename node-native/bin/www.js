const http = require('http')

const PORT = 8000

// 将app的node实例 作为服务创建
const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT)