import exec from './../db/mysql.js'
const loginCheck = (username, password) => {
    console.log(password);
    const sql = `
        select username, realname from users where username='${username}' and password='${password}';
    `
    return exec(sql).then(rows => rows[0] || {})
}

export {
    loginCheck
}