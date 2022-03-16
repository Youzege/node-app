import fs from 'fs'
import path from 'path'
import readline from 'readline'

function useReadLine () {
    let dirname = path.resolve()

    const fileName = path.join(dirname, '/logs', 'access.log')

    const readStream = fs.createReadStream(fileName)

    const readLine = readline.createInterface({ input: readStream})

    let chromeNum = 0
    let sum = 0

    // 逐行读取
    readLine.on('line', (lineData) => {
        if (!lineData) {
            return
        }

        // 记录总行数
        sum++

        const arr = lineData.split(' -- ')

        if (arr[2] && arr[2].indexOf('Chrome') > 0) {
            chromeNum++
        }
    })

    readLine.on('close', () => {
        console.log('chrome 占比:' + chromeNum / sum)
    })
}

export default useReadLine