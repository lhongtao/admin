import request from '@/utils/request'

// 获取用户信息
export function getUsers({current,pageSize,username,startTime,endTime}) {
  return request({
    url: '/admin/user/getUsers',
    method: 'get',
    params: {
      current, 
      pageSize, 
      username, 
      startTime, 
      endTime
    }
  })
}

// 根据id,username获取用户
export function getUser(param) {
  return request({
    url: 'admin/user/getUser',
    method: 'get',
    params: param
  })
}