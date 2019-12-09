const mysql=require('mysql');
const { MYSQL_CONF } = require('../config/db')

// 创建链接对象
// const db = mysql.createPool(MYSQL_CONF)
const db = mysql.createConnection(MYSQL_CONF)

// 开始链接
db.connect()

// 统一执行 sql 的函数
function exec(sql) {
  const promise = new Promise((resolve, reject)=> {
    db.query(sql, (err, result)=> {
      if(err){
        reject(err)
        return
      }
      resolve(result)
    })
  })
  return promise
}

module.exports = {
  exec,
}
