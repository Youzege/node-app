import fs from 'fs'
import path from 'path'

let dirname = path.resolve()
const fileName = dirname + '/data.txt'

// 读取文件内容
// fs.readFile(fileName, (err, data) => {
//     if (err) {
//         console.log(err)
//         return
//     }
//     // data是二进制类型，需要转换成字符串
//     console.log(data.toString())
// })

// 写入文件内容
// const content = '这是写入的内容\n'
// const opt = {
//     flag: 'a' // a 为追加写入，覆盖用 w
// }
// fs.writeFile(fileName, content, opt, (err) => {
//     if (err) {
//         console.log(err)
//     }
// })

// 判断文件是否存在 ***废弃
// fs.exists(fileName, (exist) => {
//     console.log('exist', exist)
// })

// 官网推荐的文件系统 请查阅
// http://nodejs.cn/api/fs.html#fs_fs_exists_path_callback