const { wechatService } = require('../service')
const CONFIG = require('../config')
const cache = require('memory-cache');

const CACHE_TIME = (61 + 60) * 60 * 1000 //微信 access_token的有效期目前为2个小时

module.exports = {
    async getAccessToken(req, res, next) {
        const grant_type = CONFIG.WECHAT.GRANT_TYPE
        const appid = CONFIG.WECHAT.APPID
        const secret = CONFIG.WECHAT.SECRET
        const cacheData = cache.get('accessToken')
        let result = null

        if (cacheData) {
            return res.json({
                code: 1,
                data: cacheData
            })
        }

        try {
            result = await wechatService.getAccessToken(grant_type, appid, secret)

            cache.put('accessToken', result, CACHE_TIME, function (key, value) {
                console.log(key, value);
            });

            return res.json({
                code: 1,
                data: result,
            })
        } catch (error) {
            return next(error)
        }



    }
}