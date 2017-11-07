


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
        const { ToUserName, FromUserName, CreateTime, MsgType, Content, MsgId } = req.body;

        const data = await rawBody(req,{
            length: req.headers['content-length'],
            limit:'1mb',
            encoding: contentType.parse(req).parameters.charset
        });

        // console.log('data:'+data);

        const content = await UTIL.other.parseXMLAsync(data);

        const message = UTIL.other.formatMessage(content.xml);

        console.log(message);
        
        return res.json(message);
    }
}
