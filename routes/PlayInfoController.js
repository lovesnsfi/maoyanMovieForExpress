const router = require('express').Router();
const MessageBox = require('../utils/MessageBox');
const PageJson = require('../model/PageJson');
const uuid = require('node-uuid');
const Helper = require('../utils/Helper');
const MovieInfoService = require("../services/MovieInfoService");
const HallInfoService = require("../services/HallInfoService");
const PlayInfoService = require("../services/PlayInfoService");
const OrderInfoService = require("../services/OrderInfoService");

//新增一场电影的排片
router.get("/addPlayInfo", async (req, resp) => {
  //应该获取 电影的信息与影厅的信息，然后传递到模板当中去
  try {
    var movieInfoService = new MovieInfoService();
    var hallInfoService = new HallInfoService();
    var movieInfoList = await movieInfoService.getAllList();
    var hallInfoList = await hallInfoService.getAllList();
    resp.render("PlayInfo/addPlayInfo", { movieInfoList, hallInfoList });
  } catch (error) {
    console.log(error);
  }
});

router.post("/addPlayInfo", async (req, resp) => {
  var params = { m_id, h_id, p_showtime, p_price } = req.body;
  try {
    var hallInfoService = new HallInfoService();
    var playInfoService = new PlayInfoService();
    var h_seats = await hallInfoService.getSeatsById(h_id);
    params.h_seats = h_seats;
    var flag = await playInfoService.addPlayInfo(params);
    if (flag) {
      MessageBox.showAndRedirect("添加成功", "/MovieInfo/query", resp);
    }
    else {
      MessageBox.showAndBack("添加失败", resp);
    }
  } catch (error) {
    console.log(error);
    MessageBox.showAndBack("服务器错误，请重试或联系管理员", resp);
  }
  //将上面的参数传递到后台去进行 插入
});

//因为浏览器的地址栏请求是get请求，所以我用get
router.get("/getPlayInfoDetail/:p_id", async (req, resp) => {
  //首先要判断一下用户是否已经登陆
  if (req.session.userInfo == undefined || req.session.userInfo == null) {
    //没有登陆
    resp.redirect("/Home/Login");
  }
  else {
    //从数据库拿到数据，然后传到前面的模板上面  根所p_id来拿
    var playInfoService = new PlayInfoService();
    try {
      var result = await playInfoService.findById(req.params.p_id);
      if (result.length > 0) {
        //console.log(typeof JSON.parse(result[0].h_seats));
        //一定要注意，我们存到数据库的虽然看直来像二维数组，但是它是一个字符串，我们需要转成JSON对象
        resp.render("Home/getPlayInfoDetail", { pageData: result[0], h_seats: JSON.parse(result[0].h_seats) });
      }
      else {
        MessageBox.showAndBack("当前播放的排片不存在，请刷新重试", resp);
      }
    } catch (error) {
      MessageBox.showAndBack("服务器发生错误", resp);
    }
  }

});

router.post("/submitTicker", async (req, resp) => {

  //params代表的是从前台页面接收到的值
  var params = { p_id, o_price, h_seats, h_seatsInfo } = req.body;

  //插入订单数据库所需要的值
  //插入订单信息    o_id, o_price, u_id, p_id, h_seats
  var orderParams = {
    o_id: uuid.v1(),
    o_price: params.o_price,
    u_id: req.session.userInfo.u_id,    //通过session来获取用户的ID
    p_id: params.p_id,
    h_seats: h_seatsInfo
  };
  //改更座位状态所需要的值
  var seatsParams = {
    p_id: params.p_id,
    h_seats: params.h_seats
  };

  //第三步：分别进行数据库的操作
  try {
    var orderInfoService = new OrderInfoService();
    var playInfoService = new PlayInfoService();
    //向订单表里插入订单信息
    var orderResult = await orderInfoService.addOrderInfo(orderParams);
    if (orderResult) {
      var playInfoResult = await playInfoService.updateSeats(seatsParams);
      if (playInfoResult) {
        resp.json(new PageJson("success", "订单提交成功"));
      }
      else {
        resp.json(new PageJson("error", "订单提交失败，请重试或联系管理员"));
      }
    }
    else {
      //插入失败
      resp.json(new PageJson("error", "提交订单失败,请重试"));
    }
  } catch (error) {
    resp.json(new PageJson("error", "提交订单失败,服务器错误"));
  }
})


module.exports = router;