import request from '@/utils/request'

// Upload picture
export function uploadFiles(data) {
  return request({
    url: '/admin/file/upload',
    method: 'post',
    data
  })
}

// 提交留言
export function createMessage(data) {
  return request({
    url: '/message/create',
    method: 'post',
    data
  })
}

// 获得留言
export function getMessageBoard() {
  return request({
    url: '/message/list',
    method: 'get',
  })
}

// 获得聊天记录列表
export function getChatList() {
  return request({
    url: '/chat/list',
    method: 'get',
  })
}

// 获取用户
export function getAllUserList() {
  return request({
    url: '/user/getAllUsers',
    method: 'get'
  })
}

// 测试
export function getBanner() {
  return request({
    url: '/admin/banners',
    method: 'get'
  })
}