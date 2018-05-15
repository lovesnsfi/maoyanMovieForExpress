const DBUtil = require("../utils/DBUtil");
const Helper = require('../utils/Helper');
const PageList = require("../model/PageList");

class UserInfoService {
    //检查手机号是否存在
    checkTel(u_tel) {
            return new Promise((resolve, reject) => {
                var conn = DBUtil.getConn();
                conn.query("select * from userinfo where u_tel=? and isDel=false ", [u_tel], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result.length > 0) {
                            resolve(false); //已存在
                        } else {
                            resolve(true); //不存在
                        }
                    }
                });
                conn.end();
            });
        }
        //检查邮箱是否存在
    checkEmail(u_email) {
            return new Promise((resolve, reject) => {
                var conn = DBUtil.getConn();
                conn.query("select * from userinfo where u_email=? and isDel=false ", [u_email], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result.length > 0) {
                            resolve(false); //已存在
                        } else {
                            resolve(true); //不存在
                        }
                    }
                });
                conn.end();
            });
        }
        //添加验证码到数据库
    addVCode({ v_code, u_email }) {
            return new Promise((resolve, reject) => {
                var conn = DBUtil.getConn();
                var strSql = "INSERT INTO `movie`.`vcode` (`v_code`, `u_email`, `sendTime`) VALUES (?, ?, ?)";
                conn.query(strSql, [v_code, u_email, new Date()], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result.affectedRows > 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                });

                conn.end();
            });
        }
        //验证邮箱的验证码
    checkVCode({ v_code, u_email }) {
            return new Promise((resolve, reject) => {
                var conn = DBUtil.getConn();
                var str = "select * from vcode where v_code=? and u_email=? and isDel=false ";
                conn.query(str, [v_code, u_email], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result.length > 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                });
                conn.end();
            });
        }
        //新增用户
    addUserInfo({ u_name, u_sex, u_nickname, u_password, u_tel, u_email }) {
            return new Promise((resolve, reject) => {
                var conn = DBUtil.getConn();
                var insertSql = "INSERT INTO `movie`.`userinfo` (`u_name`, `u_sex`, `u_nickname`, `u_password`, `u_tel`, `u_email`) VALUES (?, ?, ?, ?, ?, ?)";
                conn.query(insertSql, [u_name, u_sex, u_nickname, u_password, u_tel, u_email], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.affectedRows > 0 ? true : false);
                    }
                });
                conn.end();
            });
        }
        //检查用户名是否存在
    checku_name(u_name) {
        return new Promise((resolve, reject) => {
            var conn = DBUtil.getConn();
            conn.query("select * from userinfo where u_name=? and isDel=false ", [u_name], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length > 0) {
                        resolve(false); //已存在
                    } else {
                        resolve(true); //不存在
                    }
                }
            });
            conn.end();
        });
    }
    checkLogin({ u_name, u_password }) {
        return new Promise((resolve, reject) => {
            var strMail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            var strTel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            var strSql = "select * from userinfo where isDel=false and  u_password=? ";
            if (strMail.test(u_name)) {
                strSql += " and u_email =? ";
            } else if (strTel.test(u_name)) {
                strSql += " and u_tel = ? ";
            } else {
                strSql += " and u_name = ? ";
            }
            var conn = DBUtil.getConn();
            conn.query(strSql, [u_password, u_name], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
            conn.end();
        });
    }
}


module.exports = UserInfoService;