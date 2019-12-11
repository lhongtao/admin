const express=require('express');
const { getBrands, updateBrand, createBrand, deleteBrand } = require('../../controller/brand')

function handleRes(ctx, next, res) {
  if (res.status === 0) {
    ctx.body = res
  } else {
    ctx.status = res.httpCode
    ctx.body = res
  }
}

module.exports = function (){
  var router = express.Router();
  // 获取品牌
  router.get('/getBrands', async function (req, res) {
    const data = await getBrands()
    res.send(data).end() // 数据发送给前台
  })
  
  // 修改品牌
  router.post('/update', async function (req, res) {
    const data = await updateBrand(req.body)
    res.send(data).end()
  })

  // 添加品牌
  router.post('/create', async function (req, res) {
    const data = await createBrand(req.body)
    res.send(data).end()
  })

  // 删除品牌
  router.get('/delete', async function (req, res) {
    const data = await deleteBrand(req.query)
    res.send(data).end()
  })

  // 批量删除品牌
  // router.post('/delete', async function (req, res) {
  //   const data = await deleteBrands(req.body)
  //   res.send(data).end() 
  // })

  return router;
};
