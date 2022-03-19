const { exec, escape }  = require('./../db/mysql')
const xss = require('xss')

/**
 * 获取博客列表
 * @param {*} author 作者
 * @param {*} keyword 关键字
 * @returns 博客数组 promise对象
 */
const getList = async (author, keyword) => {
    // 1=1 作用 占位符，防止 author keyword值没有导致报错
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    const listData = await exec(sql)
    // 返回的是promise
    return listData
}

/**
 * 根据 id 返回博客详情信息
 * @param {*} id 
 * @returns 
 */
const getDetail = async (id) => {
    id = escape(id)
    const sql = `select * from blogs where id=${id}`

    const rows = await exec(sql)
    return rows[0]
}

/**
 * 新建博客 参数为博客内容
 * @param {*} blogData 
 * @returns 
 */
const newBlog = async (blogData = {}) => {
    console.log(blogData);
    // 获取博客对象
    let { title, content, author } = blogData
    title = escape(xss(title))
    content = escape(xss(content))

    const createtime = Date.now()
    const sql = `
        insert into blogs (title, content, createtime, author)
        values (${title}, ${content}, '${createtime}', '${author}');
    `
    const insertData = await exec(sql)
    return insertData
}

/**
 * 更新博客
 * @param {*} id id更新博客的ID
 * @param {*} blogData 更新博客的内容
 * @returns 
 */
 const updateBlog = async (id, blogData = {}) => {
    let { title, content } = blogData
    title = escape(xss(title))
    content = escape(xss(content))

    const sql = `
        update blogs set title=${title}, content=${content} where id=${id}
    `
    const updateData = await exec(sql)
    return updateData.affectedRows > 0 ? true : false
}

/**
 * 删除博客
 * @param {*} id id删除博客的ID
 * @returns 
 */
 const delBlog = async (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}';`

    const delData = await exec(sql)
    return delData.affectedRows > 0 ? true : false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}