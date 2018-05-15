const VCodeTemplate = require('../model/VCodeTemplate');
const mailer = require('nodemailer');
class Helper {
    //验证是否为空
    static isNullOrUndefined(value) {
        if (value != null && value != "" && value != undefined) {
            return false;
        } else {
            return true;
        }
    }
    static objectValidate(obj) {
            var flag = true; //验证通过
            var arr = Object.keys(obj);
            //for in 在遍历的时候，拿属性，它如果有继承关系，会拿到父级对象的属性
            for (var i of arr) {
                if (Helper.isNullOrUndefined(obj[i])) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        //生成验证码，并发送邮件
    static sendVCode(u_email, VCode) {
        //第一步：配置我位的nodemailer
        //第二步：准备要发送内容
        //第三步：发送邮件
        var transport = mailer.createTransport({
            host: "smtp.qq.com",
            port: 465,
            secureConnection: true,
            auth: {
                user: "1540250474@qq.com",
                pass: "grbrpylfsfbbhgfg"
            }
        });

        var vCodeTemplate = new VCodeTemplate(VCode)
        return new Promise((resolve, reject) => {
            transport.sendMail({
                to: u_email,
                from: "1540250474@qq.com",
                subject: "注册验证码",
                text: vCodeTemplate.toString(),
                html: vCodeTemplate.toString()
            }, (err, info) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        });
    }
}

module.exports = Helper;