class VCodeTemplate {
    constructor(VCode) {
        this.VCode = VCode;
        this.now = (new Date()).toLocaleDateString();
    }
    toString() {
        return `尊敬的用户：你好！<br />
        你本次注册的验证码为${this.VCode},有效期30分钟，如本次注册不是您本人操作，请忽略此条信息！
        【江汉大学 校园电影平台】
        ${this.now}`
    }
}

module.exports = VCodeTemplate;