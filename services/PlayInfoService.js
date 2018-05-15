const DBUtil=require("../utils/DBUtil");
const Helper=require('../utils/Helper');
const PageList=require("../model/PageList");

class PlayInfoService{
  addPlayInfo({m_id, h_id, p_showtime, p_price,h_seats}){
    //在这个地方，我们还差一个坐位的状态
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      var strInsertSql="INSERT INTO `movie`.`playinfo` ( `m_id`, `h_id`, `p_showtime`, `p_price`, `h_seats`) VALUES (?, ?, ?, ?, ?)";
      conn.query(strInsertSql,[m_id, h_id, p_showtime, p_price,h_seats],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result.affectedRows>0?true:false);
        }
        conn.end();
      });
    });
  }
  //根据某一个电影的id获取电影的排片信息
  getPlayInfoByM_id(m_id){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      conn.query("SELECT * from playinfoview where m_id=?",[m_id],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result);
        }
        conn.end();
      })
    })
  }
  //根据主键去拿数据
  findById(p_id){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      conn.query("SELECT * FROM playinfoview where p_id=? and isDel=false ",[p_id],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result);
        }
        conn.end();
      });
    });
  }
  updateSeats({p_id,h_seats}){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      conn.query("UPDATE playinfo SET h_seats=? WHERE p_id=?",[h_seats,p_id],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result.affectedRows>0?true:false);
        }
        conn.end();
      });
    }); 
  }
}
module.exports=PlayInfoService;