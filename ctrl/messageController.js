


const CONFIG = require('../config')
const UTIL = require('../util')
const rawBody = require('raw-body')
const contentType = require('content-type')


const crypto = require('crypto');


module.exports = {
    // ToUserName	开发者微信号
    // FromUserName	发送方帐号（一个OpenID）
    // CreateTime	消息创建时间 （整型）
    // MsgType	text
    // Content	文本消息内容
    // MsgId	消息id，64位整型
    async receiveMsg(req, res, next) {


        const data = await rawBody(req, {
            length: req.headers['content-length'],
            limit: '1mb',
            encoding: contentType.parse(req).parameters.charset
        });

        const content = await UTIL.other.parseXMLAsync(data);

        // 多维数组转化为单数组
        const jsObj = UTIL.other.formatMessage(content.xml);

        // { ToUserName: 'gh_060172d1b479',
        // 0|wechat   |   FromUserName: 'oH0iKv4BufkX1z2HPdU7WR0YyhWw',
        // 0|wechat   |   CreateTime: '1511513267',
        // 0|wechat   |   MsgType: 'text',
        // 0|wechat   |   Content: 'jsObj',
        // 0|wechat   |   MsgId: '6491900049862082857' }

        const retMessage = {
            "xml": {
                "ToUserName": jsObj.FromUserName,
                "FromUserName": jsObj.ToUserName,
                "CreateTime": "12345678",
                "MsgType": "text",
                "Content": "你问我：" + jsObj.Content + "吗？"
            }
        }


     

        const xml = UTIL.other.xml2jsObj(retMessage);

        console.log('messageController - receiveMsg -->:', jsObj);

        return res.send(xml);
        // return res.send('success');
    }
}
