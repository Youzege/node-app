/**
 * 
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
 * 
 * @param {*} id 
 * @returns 根据 id 返回博客详情信息
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

export {
    getList,
    getDetail
}