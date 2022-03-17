// import genPassword from '../utils/cryp.js'
const { exec, escape }  = require('./../db/mysql')
const xss = require('xss')
const genPassword = require('./../utils/cryp')

const login = (username, password) => {
    username = escape(xss(username))
    password = genPassword(password)

    password = escape(xss(password))
    
    const sql = `
        select username, realname from users where username=${username} and password=${password};
    `
    return exec(sql).then(rows => rows[0] || {})
}

module.exports = {
    login
}