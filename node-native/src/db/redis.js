import redis from 'redis'
import { REDIS_CONF } from './../conf/db.js'

// 创建 redis 客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
    console.log(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }

            try {
                resolve( JSON.parse(val) )
            } catch (error) {
                resolve(val)
            }
        })
    })
    return promise
}

export {
    set,
    get
}