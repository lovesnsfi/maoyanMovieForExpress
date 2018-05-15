const router = require('express').Router();
const MessageBox=require('../utils/MessageBox');
const PageJson=require('../model/PageJson');

router.get("/Index",(req,resp)=>{
  resp.render("Manager/Index");
});


module.exports=router;