const express=require('express');
const { getSystems, updateSystem } = require('../../controller/system')

module.exports = function () {
  const router = express.Router()
  
  // 获取系统信息
  router.get('/getSystem', async function (req, res) {
    const data = await getSystems()
    res.send(data).end()
  })

  // 修改系统信息
  router.post('/update', async function (req, res) {
    const data = await updateSystem(req.body)
    res.send(data).end()
  })

  return router;
}