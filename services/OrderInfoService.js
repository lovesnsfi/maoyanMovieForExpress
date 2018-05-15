const DBUtil=require("../utils/DBUtil");
const Helper=require('../utils/Helper');
const PageList=require("../model/PageList");

class OrderInfoService{
  //用户提交订单的时候，就插入了一个orderInfo信息
  addOrderInfo({o_id, o_price, u_id, p_id, h_seats}){
    return new Promise((resolve,reject)=>{
      var strInsertSql="INSERT INTO `movie`.`orderinfo` (`o_id`, `o_price`, `u_id`, `p_id`, `h_seats`) VALUES (?, ?, ?, ?,?)";
      var conn=DBUtil.getConn();
      conn.query(strInsertSql,[o_id, o_price, u_id, p_id, h_seats],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result.affectedRows>0?true:false);
        }
      });
    });
  }
}

module.exports=OrderInfoService