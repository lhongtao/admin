import request from '@/utils/request'

// 微信登录
export function wechatLogin(code) {
  return request({
    url: '/admin/wechatLogin',
    method: 'post',
    params: { code }
  })
}
