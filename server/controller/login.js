const { exec } = require('../db/mysql')
const express=require('express');
const mysql=require('mysql');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRETKEY } = require('../config/secret')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const common = require('../libs/common');

/**
 * 检查用户名是否存在
 * @param {string} username 
 */
const checkName = async function (username) {
  const sql = `select username from admin_table where username='${username}'`
  const res = await exec(sql)
  return new SuccessModel({
    data: { num: res.length }
  })
}

/**
 * 登陆
 * @param {*} username 
 * @param {*} password 
 */
const login = async function (username,password) {
  const checkNameResult = await checkName(username) 
  console.log('checkNameResult', checkNameResult)
  if (!checkNameResult.data.num) {
    return new ErrorModel({
      message: '用户名不存在',
      httpCode: 400
    })
  }
  //先加密前端的密码
  var pass = common.md5(password+common.MD5_SUFFIX);
  console.log(pass)
  const sql = `select username from admin_table where username='${username}' and password='${pass}'`
  const res = await exec(sql)
  if (!res.length) {
    return new ErrorModel({
      message: '密码错误',
      httpCode: 400
    })
  }
  return new SuccessModel({
    message: '登陆成功',
    data: {
      uesrname: res[0].username,
      token: jwt.sign({ username }, TOKEN_SECRETKEY, { expiresIn: '7d' })   //7天过期时间
    }
  })
}


module.exports = {
  checkName,
  login
}