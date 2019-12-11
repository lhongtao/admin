import axios from 'axios'
// import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: 'http://localhost:8090/',
  headers: { "Content-Type": "application/json;charset=UTF-8" },
  timeout: 0,
});

service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if(getToken()){
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.error(error) // for debug
    return Promise.reject(error)
  }
)
// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default service
