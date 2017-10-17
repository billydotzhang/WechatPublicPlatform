const router = require('express').Router()

const {
    accessTokenController,
} = require('./ctrl')

router.get('/accessToken', accessTokenController.getAccessToken)

module.exports = router
