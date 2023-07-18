const TOKEN_NAME = 'hkzf_token'

const getToken = () => localStorage.getItem(TOKEN_NAME)

const setToken = () => localStorage.setItem(TOKEN_NAME)

const removeToken = () => localStorage.removeItem(TOKEN_NAME)

const isAuth = () => !!getToken()

export {getToken,setToken,removeToken,isAuth}