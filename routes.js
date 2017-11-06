const router = require('express').Router()
const wechat = require('wechat');
const CONFIG = require('./config')


const {
    accessTokenController,
    menuController,
    wechatController,
} = require('./ctrl')

router.get('/accessToken', accessTokenController.getAccessToken)
router.post('/createMenuItem', menuController.create)

// router.get('/wechat', wechat({
//     token: CONFIG.WECHAT.TOKEN,
//     appid: CONFIG.WECHAT.APPID,
//     encodingAESKey: 'q2ExJXoQuMpTVKWJOaVGAXw5VrhIxpgfFIUSS8FFsEV',
//     checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
// }, wechatController.vailWechat))
router.get('/', wechatController.verification)
router.get('/wechat', wechatController.verification)

module.exports = router
