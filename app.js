//导入express 构建Web项目
const express = require('express');
const app = express();

//导入cookie与session
const cookieParser=require("cookie-parser");
app.use(cookieParser("adfasdfasdfasdbadoiperqpwe"));
const session=require('express-session');
app.use(session({
    secret:"adfasdfasdfasdbadoiperqpwe",
    resave:true,
    saveUninitialized:true
}));
//使用模板
const template = require('express-art-template');
const path = require('path');
//设置模板
app.set("views", path.join(__dirname, "./views"));
app.engine(".html", template);
app.set("view engine", "html");
//设置post接收值 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//设置静态区域
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use("/fileUpload", express.static(path.join(__dirname, "./fileUpload")));

//所有的请求都是经过app.js的，那么，现在，我就要建构app.js与路由的关系

app.get("/", (req, resp) => {
    resp.redirect("/Home/Index");
})

app.use("/AdminInfo", require("./routes/AdminInfoController"));
app.use("/Manager", require("./routes/ManagerController"));
app.use("/MovieInfo", require("./routes/MovieInfoController"));
app.use("/Home", require("./routes/HomeController"));
app.use("/UserInfo", require("./routes/UserInfoController"));
app.use("/HallInfo",require("./routes/HallInfoController"));
app.use("/PlayInfo",require("./routes/PlayInfoController"));

app.listen(80, () => {
    console.log("服务启动成功，端口：80");
})