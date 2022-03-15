
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
        this.errno = 0
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
        this.errno = -1
    }
}

export {
    SuccessModel,
    ErrorModel
}