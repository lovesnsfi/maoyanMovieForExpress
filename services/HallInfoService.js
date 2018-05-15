const DBUtil=require("../utils/DBUtil");
const Helper=require('../utils/Helper');
const PageList=require("../model/PageList");

class HallInfoService{
  addHallInfo({h_name,h_seats}){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      var strSql="INSERT INTO `movie`.`hallinfo` (`h_name`, `h_seats`) VALUES (?, ?)";
      conn.query(strSql,[h_name,h_seats],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result.affectedRows>0?true:false);
        }
        conn.end();
        //数据库连接池
      });
    });
  }
  //获取所有影厅的信息
  getAllList(){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      conn.query("select * from hallinfo where isDel=false ",[],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result);
        }
        conn.end();
      });
    })
  }
  //根据影厅id拿到影厅的坐位排列
  getSeatsById(h_id){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      conn.query("select * from hallinfo where h_id=? and isDel=false ",[h_id],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result[0].h_seats);
        }
      });
    });
  }
}

module.exports=HallInfoService;