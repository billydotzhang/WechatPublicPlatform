const { wechatService } = require('../service')
const CONFIG = require('../config')

module.exports = {
    async create(req, res, next) {
        const accessToken = req.query.accessToken;
        const data = req.body;
        let result = null

        try {
            result = await wechatService.createMenuItem(accessToken, data)
        } catch (error) {
            return next(error)
        }

        return res.json({
            code: 1,
            msg: '创建成功'
        })
    }
}