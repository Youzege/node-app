const mysql = require('mysql')
const { MYSQL_CONF } = require('./../conf/db')

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
const escape = mysql.escape

module.exports = {
    exec,
    escape
}
