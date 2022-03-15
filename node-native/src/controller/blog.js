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

    return {
        id: 1,
        title: '标题A',
        content: '内容A',
        createTime: 1647340327044,
        author: 'youzege'
    }
}

/**
 * 新建博客 参数为博客内容
 * @param {*} blogData 
 * @returns 
 */
const newBlog = (blogData = {}) => {

    return {
        id: 3
    }
}

/**
 * 更新博客
 * @param {*} id id更新博客的ID
 * @param {*} blogData 更新博客的内容
 * @returns 
 */
 const updateBlog = (id, blogData = {}) => {

    return true
}

/**
 * 删除博客
 * @param {*} id id删除博客的ID
 * @returns 
 */
 const delBlog = (id) => {

    return true
}

export {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}