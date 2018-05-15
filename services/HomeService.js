const DBUtil=require("../utils/DBUtil");
const MovieInfoService=require('./MovieInfoService');

//有两种方法
//第一种方法  
// class HomeService{
//   async query(pageIndex){
//     var movieInfoService=new MovieInfoService();
//     try {
//       var pageList = await movieInfoService.query({m_name:"",pageIndex:pageIndex});
//       return pageList;
//     } catch (error) {
//       console.log(error);
//     }
    
//   }
// }

//第二种
//我当前的这对象继承了另一个对象以后，我就可以使用它的方法
class HomeService extends MovieInfoService{

}

module.exports=HomeService;