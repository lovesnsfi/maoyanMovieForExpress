const router = require('express').Router();
const MessageBox = require('../utils/MessageBox');
const PageJson = require('../model/PageJson');
const uuid = require('node-uuid');
const Helper = require('../utils/Helper')
const path = require('path');
const fs = require('fs');
const UserInfoService = require('../services/UserInfoService');

router.get("/checkTel/:u_tel", async(req, resp) => {
    var userInfoService = new UserInfoService();
    var pageJson = null;
    try {
        var flag = await userInfoService.checkTel(req.params.u_tel);

        if (flag) {
            pageJson = new PageJson("success", "当前手机号可以使用");

        } else {
            pageJson = new PageJson("error", "当前手机号已被注册");
        }
    } catch (error) {
        pageJson = new PageJson("error", "服务器错误，请重试或联系管理员");
    } finally {
        //无论是进入了try  还是catch  最终都会到finally
        //最后都会到这里来
        resp.json(pageJson);
    }
})

router.get("/checkEmail/:u_email", async(req, resp) => {
    var userInfoService = new UserInfoService();
    var pageJson = null;
    try {
        var flag = await userInfoService.checkEmail(req.params.u_email);

        if (flag) {
            //当前手机号如果可以使用，我们就要发送验证码邮件了
            var VCode = Math.floor(Math.random() * 10000);
            //这一个地方的mailFlag是发送邮件的状态   true代表发送成功  false代表发送失败
            var mailFlag = await Helper.sendVCode(req.params.u_email, VCode);
            //如果生成成功以后，我们就需要去验证这些验证码？
            //除了把值放到数据库存起来，我们还有没有其它的方法存下这个验证码，以便后期别人登陆的时候做验证？
            if (mailFlag) {
                var addVCodeFlag = await userInfoService.addVCode({ v_code: VCode, u_email: req.params.u_email });
                if (addVCodeFlag) {
                    pageJson = new PageJson("success", "验证码发送成功，请到邮箱查看");
                } else {
                    pageJson = new PageJson("error", "验证码获取失败，请重试或联系管理员");
                }
            } else {
                pageJson = new PageJson("error", "验证码获取失败，请重试或联系管理员");
            }
        } else {
            pageJson = new PageJson("error", "当前邮箱已被注册");
        }
    } catch (error) {
        console.log(error);
        pageJson = new PageJson("error", "服务器错误，请重试或联系管理员");
    } finally {
        //无论是进入了try  还是catch  最终都会到finally
        //最后都会到这里来
        resp.json(pageJson);
    }
})

//判断某一个邮箱的验证码是否是正确的
router.get("/checkVCode/:v_code/:u_email", async(req, resp) => {
    var params = {
        v_code,
        u_email
    } = req.params;
    var userInfoService = new UserInfoService();
    try {
        var flag = await userInfoService.checkVCode(params);
        if (flag) {
            resp.json(new PageJson("success", "验证码通过"))
        } else {
            resp.json(new PageJson("error", "验证码不正确"));
        }
    } catch (error) {
        resp.json(new PageJson("error", "服务器错误"));
    }
})

//注册用户
router.post("/registerUser", async(req, resp) => {
    var params = {
        u_name,
        u_sex,
        u_nickname,
        u_password,
        u_tel,
        u_email
    } = req.body;
    //将接收到的数据存放在数据表中
    var userInfoService = new UserInfoService();
    try {
        var flag = await userInfoService.addUserInfo(params);
        if (flag) {
            resp.json(new PageJson("success", "注册成功"));
        } else {
            resp.json(new PageJson("error", "注册失败"));
        }
    } catch (error) {
        resp.json(new PageJson("error", "服务器错误，请重试或联系管理员"));
    }
})

router.get("/checku_name/:u_name", async(req, resp) => {
    var userInfoService = new UserInfoService();
    try {
        var flag = await userInfoService.checku_name(req.params.u_name);
        if (flag) {
            resp.json(new PageJson("success", "当前用户可以使用"));
        } else {
            resp.json(new PageJson("error", "当前用户已存在，请换一个试一下"));
        }
    } catch (error) {
        resp.json(new PageJson("error", "服务器错误，请重试或联系管理员"));
    }
});

router.post("/checkLogin", async(req, resp) => {
    var params = {
        u_name,
        u_password
    } = req.body;
    //到数据库当中，去检查一下，我们的用户名与官能是否正确
    var userInfoService = new UserInfoService();
    try {
        var result = await userInfoService.checkLogin(params);
        if (result.length > 0) {
            result[0].u_password = ""; //一定要把它的密码清空掉
            req.session.userInfo = result[0];
            resp.json(new PageJson("success", "登陆成功", result[0]));
        } else {
            resp.json(new PageJson("error", "登陆失败，用户名或密码不正确"));
        }
    } catch (error) {
        console.log(error);
        resp.json(new PageJson("error", "服务器错误，请重试或联系管理员"));
    }
});



module.exports = router;