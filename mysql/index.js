import mysql from 'mysql'

// 创建链接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'nodeblog'
})

// 开始连接数据库
con.connect()

// 执行sql语句
const sql = 'select * from users;'

//查询
con.query(sql, (err, result) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(result)
})

// 关闭连接
con.end()
