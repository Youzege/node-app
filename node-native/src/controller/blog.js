import exec from './../db/mysql.js'

/**
 * 获取博客列表
 * @param {*} author 作者
 * @param {*} keyword 关键字
 * @returns 博客数组 promise对象
 */
const getList = (author, keyword) => {
    // 1=1 作用 占位符，防止 author keyword值没有导致报错
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回的是promise
    return exec(sql)
}

/**
 * 根据 id 返回博客详情信息
 * @param {*} id 
 * @returns 
 */
const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`

    return exec(sql).then(rows => rows[0])
}

/**
 * 新建博客 参数为博客内容
 * @param {*} blogData 
 * @returns 
 */
const newBlog = (blogData = {}) => {
    // 获取博客对象
    const { title, content, author } = blogData
    const createtime = Date.now()
    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', '${createtime}', '${author}');
    `

    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}

/**
 * 更新博客
 * @param {*} id id更新博客的ID
 * @param {*} blogData 更新博客的内容
 * @returns 
 */
 const updateBlog = (id, blogData = {}) => {
    const { title, content } = blogData

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `

    return exec(sql).then(updateData => updateData.affectedRows > 0 ? true : false)
}

/**
 * 删除博客
 * @param {*} id id删除博客的ID
 * @returns 
 */
 const delBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}';`

    return exec(sql).then(delData => delData.affectedRows > 0 ? true : false)
}

export {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}