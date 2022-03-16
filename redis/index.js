import redis from 'redis'

// 创建 redis 客户端
const redisClient = redis.createClient(6379, '127.0.0.1')

redisClient.on('error', err => {
    console.log(err)
})

// 测试 redis
redisClient.set('username', 'youzege', redis.print)

redisClient.get('username', (err, val) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('val', val)

    // 退出
    redisClient.quit()
})