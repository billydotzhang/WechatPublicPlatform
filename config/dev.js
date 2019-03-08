module.exports = {

    DEBUG: true,

    MONGO_DB: 'mongodb://127.0.0.1:27017/wechatpublicplatform',

    WECHAT: {
        PROTOCOL: 'https',

        TOKEN: 'wechat',

        HOST: 'api.weixin.qq.com',

        GET_ACCESSTOKEN_PATH: '/cgi-bin/token',

        GRANT_TYPE: 'client_credential',

        //测试号
        APPID: '你的APPID',
        APP_SECRET: '你的APP_SECRET',
        

        CREATE_MENU_ITEM: '/cgi-bin/menu/create',
    }

}