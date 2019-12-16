const { exec } = require('../db/mysql')
const express=require('express');
const mysql=require('mysql');
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { dateNow } = require('../utils/filter')

/**
 * 获取系统基本信息
 */
const getSystems = async () => {
  const sql = `SELECT * FROM system_info`
  const res = await exec(sql)
  return new SuccessModel({
    data: res,
    message: 'ok'
  })
}

/**
 * 修改系统信息
 * @param {*} param
 */
const updateSystem = async (param) => {
  const { email, tel, mobile, address } = param
  if (!email && !tel && !mobile && !address) {
    return new ErrorModel({
      message: '参数异常',
      httpCode: 400
    })
  }
  const sql = `UPDATE system_info SET email='${email}', tel='${tel}', mobile='${mobile}', address='${address}'`
  const res = await exec(sql)
  return new SuccessModel({
    data: res,
    message: '修改成功'
  })
}


module.exports = {
  getSystems,
  updateSystem
}