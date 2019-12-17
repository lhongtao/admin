import request from '@/utils/request'

// 登录
export function login(username,password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}
