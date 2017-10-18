const router = require('express').Router()

const {
    accessTokenController,
    menuController
} = require('./ctrl')

router.get('/accessToken', accessTokenController.getAccessToken)
router.post('/createMenuItem', menuController.create)

module.exports = router
