//这个对象，主要负责在页面上面弹出消息
class MessageBox{
  //弹窗以后重定向
  static showAndRedirect(msg,url,resp){
    // resp.send(`<script>alert('登陆成功');</script>`)
    resp.send(`<script>alert('${msg}');location.href='${url}'</script>`)
  }
  //弹窗以后返回
  static showAndBack(msg,resp){
    resp.send(`<script>alert('${msg}');history.back();</script>`)
  }
}

module.exports=MessageBox;