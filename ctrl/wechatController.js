const CONFIG = require('../config')


const crypto = require('crypto');


module.exports = {
    async verification(req, res, next) {
        //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
        var signature = req.query.signature,//微信加密签名
            timestamp = req.query.timestamp,//时间戳
            nonce = req.query.nonce,//随机数
            echostr = req.query.echostr;//随机字符串

        //2.将token、timestamp、nonce三个参数进行字典序排序
        var array = [CONFIG.WECHAT.TOKEN, timestamp, nonce];
        array.sort();

        console.log(req.query);


        //3.将三个参数字符串拼接成一个字符串进行sha1加密
        var tempStr = array.join('');
        const hashCode = crypto.createHash('sha1'); //创建加密类型 
        var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

        //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if (resultCode === signature) {
            return res.send(echostr);
        } else {
            return res.send('bad token');
        }

        // return res.send(req.query.echostr)

        // 微信输入信息都在req.weixin上
        // var message = req.weixin;
        // if (message.FromUserName === 'diaosi') {
        //     // 回复屌丝(普通回复)
        //     res.reply('hehe');
        // } else if (message.FromUserName === 'text') {
        //     //你也可以这样回复text类型的信息
        //     res.reply({
        //         content: 'text object',
        //         type: 'text'
        //     });
        // } else if (message.FromUserName === 'hehe') {
        //     // 回复一段音乐
        //     res.reply({
        //         type: "music",
        //         content: {
        //             title: "来段音乐吧",
        //             description: "一无所有",
        //             musicUrl: "http://mp3.com/xx.mp3",
        //             hqMusicUrl: "http://mp3.com/xx.mp3",
        //             thumbMediaId: "thisThumbMediaId"
        //         }
        //     });
        // } else {
        //     // 回复高富帅(图文回复)
        //     res.reply([
        //         {
        //             title: '你来我家接我吧',
        //             description: '这是女神与高富帅之间的对话',
        //             picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        //             url: 'http://nodeapi.cloudfoundry.com/'
        //         }
        //     ]);
        // }
    }
}
