const router = require('express').Router();
const MessageBox=require('../utils/MessageBox');
const PageJson=require('../model/PageJson');
const HallInfoService=require("../services/HallInfoService");

router.get("/addHallInfo",(req,resp)=>{
  resp.render("HallInfo/addHallInfo");
});

router.post("/addHallInfo",async (req,resp)=>{
  var params={h_name,h_seats}=req.body;
  try {
    var hallInfoService=new HallInfoService();
    var flag=await hallInfoService.addHallInfo(params);
    if(flag){
      resp.json(new PageJson("success","添加成功"));
    }
    else{
      resp.json(new PageJson("error","添加失败"));
    }
  } catch (error) {
    resp.json(new PageJson("error","数据库添加失败"));
  }
});
module.exports=router;