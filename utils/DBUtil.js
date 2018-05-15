const mysql=require('mysql');

class DBUtil{
  static getConn(){
    var conn=mysql.createConnection({
      host:"127.0.0.1",
      port:3306,
      user:"root",
      password:"123456",
      database:"movie",
      multipleStatements:true   //开启多条SQL执行支持
    });
    conn.connect();
    return conn;
  }
}
//如果我现在要反这个DBUtil放在其它 的文件里面去使用，那么，
//我就必须通过module.exports导出来 供其它人使用
module.exports=DBUtil;
