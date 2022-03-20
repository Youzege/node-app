const env = process.env.NODE_ENV // 环境变量

// 配置
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'mine_server'
    }
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {
    MYSQL_CONF = {
        host: '112.74.95.70',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'my_blog'
    }
    REDIS_CONF = {
        port: 6379,
        host: '112.74.95.70'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}
