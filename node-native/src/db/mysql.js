import mysql from 'mysql'
import { MYSQL_CONF } from './../conf/db.js'

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

/**
 * 统一执行sql的函数
 * @param {*} sql 
 */
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

export default exec
