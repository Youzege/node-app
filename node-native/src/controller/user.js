const loginCheck = (username, password) => {

    if (username === 'youzege' && password === '123') {
        return true
    }

    return false
}

export {
    loginCheck
}