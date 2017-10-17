const { toolset } = require('../util')
const qs = require('qs')
const CONFIG = require('../config')

module.exports = {
    async getAccessToken(grant_type, appid, secret) {
        const qsBbj = {
            grant_type,
            appid,
            secret
        }

        const url = `${CONFIG.WECHAT.PROTOCOL}://${CONFIG.WECHAT.HOST}${CONFIG.WECHAT.GET_ACCESSTOKEN_PATH}?${qs.stringify(qsBbj)}`
        const headers = { 'User-Agent': 'curl/7.19.7' }
        const errMsg = '获取微信access token失败'
        const data = JSON.parse(await toolset.fetchPlayDataFromWebByGET(url, headers, errMsg))
        if ('errcode' in data) {
            throw new Error(data)
        }
        return data
    }
}