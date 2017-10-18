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
        const result = JSON.parse(await toolset.fetchPlayDataFromWebByGET(url, headers, errMsg))
        if ('errcode' in result && result.errcode !== 0) {
            throw new Error(result.errmsg)
        }
        return result
    },
    async createMenuItem(accessToken, data) {
        const url = `${CONFIG.WECHAT.PROTOCOL}://${CONFIG.WECHAT.HOST}${CONFIG.WECHAT.CREATE_MENU_ITEM}?access_token=${accessToken}`
        const headers = { 'User-Agent': 'curl/7.19.7' }
        const errMsg = '创建微信菜单失败'
        const result = await toolset.fetchPlayDataFromWebByPost(url, headers, data, errMsg)
        if ('errcode' in result && result.errcode !== 0) {
            throw new Error(result.errmsg)
        }
        return result
    }
}