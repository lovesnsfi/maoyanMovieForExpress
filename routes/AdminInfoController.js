//构建路由
//路由的作用就是用来分担我们的app.js这个文件的压力，把代码拆分出来
const router = require('express').Router();
const MessageBox=require('../utils/MessageBox');
const PageJson=require('../model/PageJson');
const AdminInfoService=require('../services/AdminInfoService');

router.get("/Login", (req, resp) => {
    //渲染视图
    resp.render("AdminInfo/Login");
});

router.post("/checkLogin", (req, resp) => {
    var params={admin_id,admin_password}=req.body;
    //现在就要涉及到数据库操作了
    var adminInfoService=new AdminInfoService();
    adminInfoService.checkLogin(params,(flag,result)=>{
        //第一个参数flag代表的是数据库的执行结果
        if(flag){
            //这个时候的result就是真正的数据库执行结果
           if(result.length==1){
                MessageBox.showAndRedirect("登陆成功","http://www.baidu.com",resp);
           }
           else{
            MessageBox.showAndRedirect("登陆失败","/AdminInfo/Login",resp);
           }
        }
        else{
            //这个地方的result就是数据库错误信息
            MessageBox.showAndRedirect("登陆失败","/AdminInfo/Login",resp);
        }
    })
})



router.post("/checkLoginAjax",(req,resp)=>{
    var params={admin_id,admin_password}=req.body;
    //现在就要涉及到数据库操作了
    var adminInfoService=new AdminInfoService();
    adminInfoService.checkLogin(params,(flag,result)=>{
        //第一个参数flag代表的是数据库的执行结果
        if(flag){
            //这个时候的result就是真正的数据库执行结果
           if(result.length==1){
                resp.json(new PageJson("success","登陆成功",result[0]));
           }
           else{
                resp.json(new PageJson("error","用户名或密码错误"));
           }
        }
        else{
            //这个地方的result就是数据库错误信息
            
            resp.json(new PageJson("error","服务器错误，请重试或联系管理员"));
        }
    })
})

module.exports = router;