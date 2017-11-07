const CONFIG = require('./config');

const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');


const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// const logger = require( 'morgan' )
// const auth = require('./app/midware/auth');

const app = express();
const router = require('./routes')



mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.MONGO_DB)


app.locals.moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// 检验ts和token
// app.use(auth.auth);

// 路由
app.use(router) // router

// 404
app.use(function (req, res, next) {
    next(new Error('Not Found'));
});

// 统一错误处理
app.use(({ code = -1, message, stack }, req, res, next) => { // eslint-disable-line
    res.json({ code, msg: message })
    if (req.method === 'OPTIONS') return
    console.log('err:==>', message);
})

app.listen(CONFIG.PORT);

console.log('wechatpublicplatform started on PORT ' + CONFIG.PORT);

