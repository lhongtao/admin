const express=require('express');
const { login } = require('../../controller/login')

module.exports=function (){
  var router = express.Router();

  router.post('/',async (req, res) => {
    const { username, password } = req.body
    const data = await login(username, password)
    res.send(data).end()
  })

  return router;
};
