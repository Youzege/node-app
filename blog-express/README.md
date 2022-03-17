## express 框架



开发流

- express下载、安装和使用，express中间件机制
- 开发接口、连接数据库、实现登录、日志记录
- 分析express中间件原理



#### express安装

##### express-generator脚手架

安装脚手架：`npm install express-generator -g`

使用脚手架：express '项目名称'

安装一些插件：nodemon、cross-env



#### express app.js入口代码

脚手架给我们创建的一些插件



`express`插件：框架实例



`createError`插件：处理404错误。

```js
const createError = require('http-errors');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
```



`cookieParser`插件：处理cookie的插件

```js
app.use(cookieParser());
```



`morgan`插件：日志处理

```js
const logger = require('morgan');

app.use(logger('dev'));
```

