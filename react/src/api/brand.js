import request from '@/utils/request'

// 添加品牌信息
export function createBrand(data) {
  return request({
    url: '/admin/brand/create',
    method: 'post',
    data
  })
}

// 获取品牌信息
export function getBrandList() {
  return request({
    url: '/admin/brand/getBrands',
    method: 'get'
  })
}

// 修改品牌信息
export function updateBrand(data) {
  return request({
    url: '/admin/brand/update',
    method: 'post',
    data
  })
}

// 删除品牌
export function deleteBrand(id) {
  return request({
    url: '/admin/brand/delete',
    method: 'get',
    params: { id }
  })
}