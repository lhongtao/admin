const express=require('express');
const { getUsers,getUser } = require('../../controller/user')

module.exports = function () {
  let router = express.Router()

  // 获取所有用户
  router.get('/getUsers', async function (req, res) {
    const data = await getUsers(req.query)
    res.send(data).end()
  })

  // 获取用户
  router.get('/getUser', async function (req, res) {
    const data = await getUser(req.query)
    res.send(data).end()
  })
  return router
}