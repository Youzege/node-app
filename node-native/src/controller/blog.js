/**
 * 获取博客列表
 * @param {*} author 作者
 * @param {*} keyword 关键字
 * @returns blog list 博客数组
 */
const getList = (author, keyword) => {
    
    return [
        {
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 1647340327044,
            author: 'youzege'
        },
        {
            id: 2,
            title: '标题B',
            content: '内容B',
            createTime: 1647340361996,
            author: 'youzege'
        },
    ]
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