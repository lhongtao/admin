const { exec } = require('../db/mysql')
const mysql=require('mysql');
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { dateNow } = require('../utils/filter')

/**
 * 添加品牌
 * @param {*} param
 */
const createBrand = async (param) => {
  const { name, description, image } = param
  if (!name && !description && !image) {
    return new ErrorModel({
      message: '参数异常',
      httpCode: 400
    })
  }
  const date = dateNow()
  const sql = `INSERT INTO brand_list (name, description, image, date) VALUE('${name}', '${description}', '${image}', '${date}')`
  const res = await exec(sql)
  return new SuccessModel({
    data: res,
    message: '添加成功'
  })
}

/**
 * 更新品牌信息
 * @param {*} param 
 */
const updateBrand = async (param) => {
  const { name, description, image, id } = param
  if (!name || !description || !image || !id) {
    return new ErrorModel({
      message: '参数异常',
      httpCode: 400
    })
  }
  const sql = `UPDATE brand_list SET name='${name}', description='${description}', image='${image}' WHERE ID=${id}`
  const res = await exec(sql)
  return new SuccessModel({
    data: res,
    message: '修改成功'
  })
}

/**
 * 获取品牌列表
 * @param {*} param 
 */

const getBrands = async () => {
  const sql = `SELECT * FROM brand_list`
  const res = await exec(sql)
  return new SuccessModel({
    data: res
  })
}

/**
 * 删除品牌
 * @param {*} param
 */

const deleteBrand = async (param) => {
  const { id } = param
  if (!id) {
    return new ErrorModel({
      message: '参数异常',
      httpCode: 400
    })
  }
  const sql = `DELETE FROM brand_list WHERE ID=${id}`
  const res = await exec(sql)
  return new SuccessModel({
    data: res,
    message: '删除成功'
  })
}  

module.exports = {
  getBrands,
  updateBrand,
  createBrand,
  deleteBrand
}