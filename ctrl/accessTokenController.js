const { wechatService } = require('../service')
const CONFIG = require('../config')

module.exports = {
    async getAccessToken(req, res, next){
        const grant_type = CONFIG.WECHAT.GRANT_TYPE
        const appid = CONFIG.WECHAT.APPID
        const secret = CONFIG.WECHAT.SECRET
        const data = await wechatService.getAccessToken(grant_type, appid, secret)
        console.log(data);
    }
}