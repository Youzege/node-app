## 🏖️原生node.js 后台接口开发学习...



### HTTP请求的过程...

- **客户端**-DNS解析，建立TCP连接，发送HTTP请求
- **服务端**-接受HTTP请求，处理，并返回
- **客户端**-接受服务端返回的数据，处理数据(渲染页面，执行js)



#### node 处理GET请求

- **get**请求，客户端向server端获取数据，例如查询一个博客列表
- 通过querystring传递数据，例如 `a.html?a=100&b=200`
- 浏览器直接访问，就发送get请求

```js
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    console.log(req.method) // GET
    const url = req.url // 获取请求的完整URL
    req.query = querystring.parse(url.split('?')[1]) // 解析 querystring
    res.end(JSON.stringify(req.query)) // 将 querystring 返回
})
server.listen(8000)
console.log('---服务器启动啦---')

/*
* 访问 localhost:8000/api/blog/list?author=shixinguo&keyword=A
* 控制台返回
* 请求方法 method GET
* 请求URL /api/blog/list?author=shixinguo&keyword=A
* res.end 返回 { "author": "shixinguo", "keyword": "A"}
*/
```



#### node 处理POST请求

- **post**请求，客户端要向服务端传输数据，例如新建博客、登录...
- 通过post data传递数据...大概
- 浏览器无法直接模拟，需要手写js，或者使用postman

```js
const http = require('http')

const server = http.createServer((req, res) => {
    console.log('content-type', req.headers['content-type']) // POST 查看请求头
    // 接收数据 chunk 接收数据流 避免数据量大时的一些问题，分段接收
    let postData = ''
    // 监听 请求
    req.on('data', chunk => {
        postData += chunk.toString()
    })
    req.on('end', () => {
        console.log(postData)
        res.end('hello node') // 异步返回
    }) 
})
server.listen(8000)
console.log('---服务器启动啦---')
```



#### node 处理路由

- https://github.com/
- https://github.com/youzege
- https://github.com/youzege/node-app
- 代表一个url资源唯一标识



#### node HTTP请求示例

```js
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = querystring.parse(url.split('?')[1])
    
    // 设置返回格式 JSON
    req.setHeader('Content-type', 'application/json')
    
    // 返回数据
    const resData = {
        method,
        url,
        path,
        query
    }
    
    // 返回GET/POST
    if (method === 'GET') {
        res.end( JSON.stringify(resData) )
    }
    if (method === 'POST') {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            resData.postData = postData
            // 返回
            res.end( JSON.stringify(resData) )
        })
    }
})
server.listen(8000)
console.log('---服务器启动啦---')
```

