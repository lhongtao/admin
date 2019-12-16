import request from '@/utils/request'

// 获取系统基本信息
export function getSystem() {
  return request({
    url: '/admin/system/getSystem',
    method: 'get'
  })
}

// 修改系统基本信息
export function updateSystem(data) {
  return request({
    url: '/admin/system/update',
    method: 'post',
    data
  })
}