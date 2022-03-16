import fs from 'fs'
import path from 'path'

let dirname = path.resolve() + ''

//写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')
}

// 生成 write Stream
function createWriteStream(fileName) {
    const fullFileName = path.join(dirname, '/logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    })
    return writeStream
}

// 访问日志
const accessWriteStream = createWriteStream('access.log')
function access(log) {
    writeLog(accessWriteStream, log)
}

export {
    access
}