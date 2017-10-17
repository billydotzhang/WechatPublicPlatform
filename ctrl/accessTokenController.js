const { wechatService } = require('../service')
const CONFIG = require('../config')
const cache = require('memory-cache');

// const CACHE_TIME = (60 + 50) * 1000
const CACHE_TIME =  ( 50 + 60 ) * 60 * 1000 //微信 access_token的有效期目前为2个小时

module.exports = {
    async getAccessToken(req, res, next) {
        const grant_type = CONFIG.WECHAT.GRANT_TYPE
        const appid = CONFIG.WECHAT.APPID
        const secret = CONFIG.WECHAT.SECRET
        const cacheData = cache.get('accessToken')

        if (cacheData) {
            return res.json({
                code: 1,
                data: cacheData
            })
        }

        const data = await wechatService.getAccessToken(grant_type, appid, secret)

        cache.put('accessToken', data, CACHE_TIME, function (key, value) {
            console.log(key, value);
        });

        return res.json({
            code: 1,
            data,
        })

    }
}