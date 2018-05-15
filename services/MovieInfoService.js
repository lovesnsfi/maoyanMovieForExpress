const DBUtil=require("../utils/DBUtil");
const Helper=require('../utils/Helper');
const PageList=require("../model/PageList");
//专门用来处理数据库操作，与数据库的MovieInfo表对象
class MovieInfoService{
  addMovieInfo({m_id,m_name,m_description,m_actor,m_type,show_time,play_time,m_img}){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();   //获取数据库连接
      var insertSql="INSERT INTO `movie`.`movieinfo` (`m_id`, `m_name`, `m_description`, `m_actor`, `m_type`, `show_time`, `play_time`, `m_score`, `isDel`, `m_img`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      conn.query(insertSql,[m_id, m_name, m_description, m_actor, m_type, show_time, play_time, 0,false,m_img],(err,result)=>{
        if(err){
          reject(err);    //catch
        }
        else{
          if(result.affectedRows>0){
            resolve(true);
          }
          else{
            resolve(false);
          }
        }
      });

      conn.end();
    });
  }
  //分页查询
  query({m_name,pageIndex}){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      var strSql="select * from movieinfo where isDel=false ";
      var strCountSql="select count(*) 'sumCount' from movieInfo where isDel=false ";
      var strWhere="";
      //其实在这里，我们还有简便方法 
      //mongodb
      if(!Helper.isNullOrUndefined(m_name)){
        strWhere+=" and m_name like '%"+m_name+"%' ";
      }
      strSql+=strWhere+" limit ?,? ";
      strCountSql+=strWhere;
      conn.query(strSql+";"+strCountSql,[(pageIndex-1)*10,10],(err,result)=>{
        if(err){
          console.log(err);
          reject(err);
        }
        else{
          //现在这是分页数据
          var pageList=new PageList(pageIndex,result[1][0].sumCount,result[0]);
          resolve(pageList);
        }
      })
      conn.end();
    })
  }
  //根的主键去查询
  findById(m_id){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      conn.query("select * from movieinfo where isDel=false and m_id=?",[m_id],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result);
        }
      })
      conn.end();
    });
  }
  //编辑信息
  editMovieInfo({m_id, m_name, m_description, m_actor, m_type, show_time, play_time, m_img}){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      var strSql="UPDATE `movie`.`movieinfo` SET `m_name`=?, `m_description`=?, `m_actor`=?, `m_type`=?, `show_time`=?, `play_time`=?, `m_img`=? where m_id=? ";
      conn.query(strSql,[ m_name, m_description, m_actor, m_type, show_time, play_time, m_img,m_id],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          if(result.affectedRows>0){
            resolve(true);
          }
          else{
            resolve(false);
          }
        }
      });
      conn.end();
    });
  }
  deleteMovieInfo(m_id){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      conn.query("update movieinfo set isDel=true where m_id=?",[m_id],(err,result)=>{
        if(err){
          reject(err);
        }
        else{
          //affectedRows代表的是数据库受影响的行数
          if(result.affectedRows>0){
            resolve(true);
          }
          else{
            resolve(false);
          }
        }
      });
      conn.end();
    });
  }
  //获取所有的电影信息
  getAllList(){
    return new Promise((resolve,reject)=>{
      var conn=DBUtil.getConn();
      conn.query("select * from movieinfo where isDel=false ",[],(err,result)=>{
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
}


module.exports=MovieInfoService;