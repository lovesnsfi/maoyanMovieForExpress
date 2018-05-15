//建立PageJson的目的  只是为了让我们返回到前端 的json格式保持一致
class PageJson{
  constructor(status,msg,data){
    //代表请求成功与失败   success/error
    this.status=status;
    //返回到页面的提示消息
    this.msg=msg;
    //返回到页面的正式数据
    this.data=data||"";
  }
}

module.exports=PageJson;