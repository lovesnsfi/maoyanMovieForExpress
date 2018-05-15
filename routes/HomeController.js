const router = require('express').Router();
const MessageBox = require('../utils/MessageBox');
const PageJson = require('../model/PageJson');
const uuid = require('node-uuid');
const Helper = require('../utils/Helper')
const path = require('path');
const fs = require('fs');
const HomeService = require('../services/HomeService');
const PlayInfoService=require("../services/PlayInfoService");

router.get("/Index", async(req, resp) => {
    //操作数据库，读取电影数据列表
    var pageIndex = req.query.pageIndex || 1;
    try {
        var homeService = new HomeService();
        var pageList = await homeService.query({ m_name: "", pageIndex: pageIndex });
        resp.render("Home/Index", pageList);
    } catch (error) {
        console.log(error);
    }
})

//获取电影的详细信息
//同时还要获取电影的排片信息   --电影id
router.get("/movieInfoDetail/:m_id", async(req, resp) => {
    var homeService = new HomeService();
    var playInfoService=new PlayInfoService();
    try {
        var result = await homeService.findById(req.params.m_id);
        var playInfoList=await playInfoService.getPlayInfoByM_id(req.params.m_id);
        resp.render("Home/movieInfoDetail", { pageData: result[0],playInfoList:playInfoList });
    } catch (error) {
        console.log(error);
    }
})


router.get("/Login", (req, resp) => {
    resp.render("Home/Login");
});


router.post("/Register", (req, resp) => {

});
module.exports = router;