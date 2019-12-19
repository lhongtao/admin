const { exec } = require('../db/mysql')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { dateNow } = require('../utils/filter')

//用户表的列名（除去了密码）
const usersColumns = [
  'id',
  'username',
  'type',
  'createDate',
  'ip',
  'lastLoginTime',
  'lastLoginAddress',
]

/**
 * 获取全部用户信息
 * @param {*} param
 */
const getUsers = async (param) => {
  const { current = 0, pageSize = 10, username, startTime, endTime } = param
  let sql = `select SQL_CALC_FOUND_ROWS ${usersColumns.join()} from admin_table where createDate between ${startTime || 0} and ${endTime || Date.now()} `
  if (username) {
    sql += `and username like '%${username}%' `
  }
  sql += `order by createDate desc limit ${current * pageSize},${pageSize}`
  console.log('sql',sql)
  const res = await exec(sql)
  const sql2 = 'select found_rows() as total'
  const res2 = await exec(sql2)
  return new SuccessModel({
    data: {
      list: res,
      current: parseInt(current),
      pageSize: parseInt(pageSize),
      total: res2[0].total
    }
  })
}

/**
 * 获取单个用户,可根据id或用户名查询单个用户
 * @param {*} param 
 */
const getUser = async (param) => {
  const { id, username } = param
  if (!id && !username) {
    return new ErrorModel({
      message: '参数异常',
      httpCode: 400
    })
  }
  let sql = `select ${usersColumns.join()} from admin_table where `
  if (id) {
    sql += `id=${id}`
  } else if (username) {
      sql += `username='${username}'`
  }
  const res = await exec(sql)
  return new SuccessModel({
    data: res[0]
  })
}

module.exports = {
  getUsers,
  getUser
}