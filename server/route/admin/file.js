const express=require('express');
// const uploadFile = require('../utils/upload')
const { uploadFile } = require('../../controller/upload')

module.exports = function (){
  var router = express.Router();
	//上传接口
	router.post('/upload', async function (req, res) {
		const data = await uploadFile(req)
		res.send(data).end() // 数据发送给前台
	})
	
  return router;
};