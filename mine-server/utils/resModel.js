const { info, debug, error } = require('./log4j')
const { CODE } = require('./utils')

class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}

/**
 * 请求成功 返回的信息
 * @param data
 * @param message
 * @returns errno 0
 */
class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.code = CODE.SUCCESS
        if(data) {
            debug(data)
        } else {
            debug(message)
        }
    }
}

/**
 * 请求失败返回的信息
 * @param data
 * @param message
 * @returns errno -1
 */
class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.code = CODE.BUSINESS_ERROR
        if(data) {
            error(data)
        } else {
            error(message)
        }
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}