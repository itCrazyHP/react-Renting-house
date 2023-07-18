import axios from "axios";
import { getToken, removeToken } from "./auth";
import { BASE_URL } from "./url";

const API = axios.create({
    baseURL:BASE_URL
})

API.interceptors.request.use(config =>{
    const {url} = config
    if(url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('user/registered')){
        config.headers.Authorization = getToken()
    }
    return config
})

API.interceptors.response.use(response =>{
    const {status} = response.data
    if(status === 400){
        removeToken()
    }
    return response
})

export {API}