const express=require('express');
const static=require('express-static');
const bodyParser=require('body-parser');
const multer=require('multer');
const multerObj=multer({dest: './static/upload'});
const mysql=require('mysql');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
const expressRoute=require('express-route');

var server=express();

//设置允许跨域访问该服务.
server.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  // if (req.method == 'OPTIONS') {
  //   res.send(200);
  // }
  // else {
  //   next();
  // }
  next();
});
server.listen(8090, () => console.log('Example app listening on port 8090!'))

//1.获取请求数据
//get自带
server.use(bodyParser.json()); // 前台post 可以不转换form类型
server.use(bodyParser.urlencoded({ extended: false }));
server.use(multerObj.any());

//2.cookie、session
server.use(cookieParser());
(function (){
  var keys=[];
  for(var i=0;i<100000;i++){
    keys[i]='a_'+Math.random();
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000  //20min
  }));
})();

//3.模板
server.engine('html', consolidate.ejs);
server.set('views', 'template');
server.set('view engine', 'html');

//4.route
server.use('/', require('./route/web')());
server.use('/admin/', require('./route/admin')());

//5.default：static
server.use(static('static'));
server.use(static('public'));
