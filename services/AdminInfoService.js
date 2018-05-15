var DBUtil = require("../utils/DBUtil");
class AdminInfoService{
  //如非必须 ，Service里面的方法不写成静态的
  checkLogin({admin_id,admin_password},callBack){
    //数据库的操作是一个异步操作
    //1.回调
    //2.事件
    //3.Promise   --async await   
    var conn=DBUtil.getConn();
    conn.query("select * from admininfo where admin_id=? and admin_password=? and isDel=false",[admin_id,admin_password],(err,result)=>{
      if(err){
        //如果执行数据库发生错误
        callBack(false,err);
      }
      else{
        //没有发生错误
        callBack(true,result);
      }
    })
    conn.end();
  }
}

module.exports=AdminInfoService;