import { exec, escape } from './../db/mysql.js'
import xss from 'xss'
import genPassword from '../utils/cryp.js'

const login = (username, password) => {
    username = escape(xss(username))
    password = genPassword(password)
    console.log(password)
    password = escape(xss(password))
    
    const sql = `
        select username, realname from users where username=${username} and password=${password};
    `
    return exec(sql).then(rows => rows[0] || {})
}

export {
    login
}