const router = require('express').Router();
const MessageBox=require('../utils/MessageBox');
const PageJson=require('../model/PageJson');
const uuid=require('node-uuid');
const Helper=require('../utils/Helper')
const path=require('path');
const fs=require('fs');
//工厂模式
const MovieInfoService=require("../services/MovieInfoService");
//在这里，配置文件上传的模块，然后运行这个方法，里面的dest代表的是文件默认上传目录
//这个方法会返回一个对象，这个对象就是我们的文件上传管理对象
const multer=require('multer');
var upload = multer({
    dest:path.join(__dirname,"../fileUpload")
});

//影片肯定有增删改查
router.get("/addMovieInfo",(req,resp)=>{
  resp.render("MovieInfo/addMovieInfo");
});

//在这里，这个请求地址相同没有问题，因为它们的协议不一样
router.post("/addMovieInfo",async (req,resp)=>{
  var params={
    m_name,m_description,m_actor,m_type,show_time,play_time,m_img
  }=req.body;
  params.m_id=uuid.v1();
  var flag=Helper.objectValidate(params);
  if(flag){
    var movieInfoService=new MovieInfoService();
    try {
      //异步转同步操作
        var result = await movieInfoService.addMovieInfo(params)
        if(result){
          MessageBox.showAndRedirect("添加成功","/MovieInfo/query",resp);
        }
        else{
          MessageBox.showAndBack("添加失败",resp);
        }
      } catch (error) {
        MessageBox.showAndBack("服务器错误，请重试或联系管理员",resp);
      }
  }
  else{
    MessageBox.showAndBack("请将信息输入完整",resp);
  }
  
})

//查询
router.get("/query",async (req,resp)=>{
  //分页
  var params = {m_name,pageIndex}=req.query;
  params.pageIndex=params.pageIndex||1;
  var movieInfoService=new MovieInfoService();
  try {
    var pageList=await movieInfoService.query(params);
    resp.render("MovieInfo/query",{pageData:pageList});
  } catch (error) {
    
  }
});

router.post("/queryAjax",async (req,resp)=>{
  //分页
  var params = {m_name,pageIndex}=req.body;
  params.pageIndex=params.pageIndex||1;
  var movieInfoService=new MovieInfoService();
  try {
    var pageList=await movieInfoService.query(params);
    resp.render("MovieInfo/contentList",pageList);
  } catch (error) {
    
  }
})

//图片上传的功能
//这里的m_pic代表的是我只接收文件的名子为m_pic的
router.post("/uploadFile",upload.single("m_pic"),(req,resp)=>{
  //这个file就是我们后台接收到的前台传送过来的文件
  var file=req.file;
  //接收到文件以后就要保存，可是我们并不知道这个保存图片的文件夹是否存在，所以应该先判断 ，如果不存在则创建
  if(!fs.existsSync(path.join(__dirname,"../fileUpload"))){
    //不存在就创建文件夹
    fs.mkdirSync(path.join(__dirname,"../fileUpload"));
  }
  //保存文件 我们要注意，文件可能会发生重名的现像，所以我要进行重名处理 
  //默认情况下，这个上传的文件会进行uuid的全局唯一处理，所以我们可以忽略重名
  
  try {
    fs.renameSync(file.path,file.path+file.originalname);
    //如果图片上传成功了，我应该把这个图片的地址返回到浏览器，让浏览器上面显示出这一张图片
    var pageJson=new PageJson("success","图片上传成功","/fileUpload/"+file.filename+file.originalname);
    resp.json(pageJson);
  } catch (error) {
    //如果上传失败了，也要告诉课程器，你图片上传失败了
    var pageJson=new PageJson("error","图片上传失败");
    resp.json(pageJson);
  }
  
});



router.get("/movieDetail/:m_id",async (req,resp)=>{
  var movieInfoService=new MovieInfoService();
  try {
    var result=await movieInfoService.findById(req.params.m_id);
    resp.render("MovieInfo/movieDetail",{pageData:result[0]});
  } catch (error) {
    
  }
  
});

//修改
router.get("/editMovieInfo/:m_id",async (req,resp)=>{
  var movieInfoService=new MovieInfoService();
  try {
    var result=await movieInfoService.findById(req.params.m_id);
    resp.render("MovieInfo/editMovieInfo",{pageData:result[0]});
  } catch (error) {
    
  }
})

router.post("/editMovieInfoPost",async (req,resp)=>{
  var params={m_id, m_name, m_description, m_actor, m_type, show_time, play_time, m_img}=req.body;
  console.log(params);
  var movieInfoService=new MovieInfoService();
  try {
    var flag=await movieInfoService.editMovieInfo(params);
    if(flag){
      MessageBox.showAndRedirect("修改成功","/MovieInfo/query",resp);
    }
    else{
      MessageBox.showAndBack("修改失败",resp);
    }
  } catch (error) {
    console.log(error);
  }
})

//删除
router.get("/deleteMovieInfo/:m_id",async (req,resp)=>{
  var movieInfoService=new MovieInfoService();
  try {
    var flag= await movieInfoService.deleteMovieInfo(req.params.m_id);
    if(flag){
      resp.json(new PageJson("success","删除成功"));
    }
    else{
      resp.json(new PageJson("error","删除失败"));
    }
  } catch (error) {
    
  }
});

module.exports=router;