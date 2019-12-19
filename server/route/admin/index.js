const express=require('express');
const common=require('../../libs/common');

module.exports=function (){
  var router=express.Router();

  //检查登录状态
  router.use((req, res, next)=>{
    // if(!req.session['admin_id'] && req.url!='/login'){ //没有登录
    //   res.redirect('/admin/login');
    // }else{
    //   next();
    // }
    next();
  });

  router.get('/', (req, res)=>{
    res.render('admin/index.ejs', {});
  });

  router.use('/login', require('./login')());
  router.use('/banners', require('./banners')());
  router.use('/brand', require('./brand')());
  router.use('/custom', require('./custom')());
  router.use('/file', require('./file')());
  router.use('/system', require('./system')());
  router.use('/user', require('./user')());

  return router;
};
