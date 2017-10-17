const crypto = require('crypto')
const request = require('request')
const _ = require('lodash')
// const { parseString } = require('xml2js')
const moment = require('moment')
require('moment/locale/zh-cn')

const HTTP_REQUEST_REPONSE_BACK_TIMEOUT = 8000 // http请求超时时间
module.exports = {
    /* 获取日期
     * @param day
     * @returns {*}
     */
    getDay(day) {
        return `${day.getFullYear()}-${day.getMonth() + 1 < 10 ? `0${day.getMonth() + 1}` : day.getMonth() + 1}-${day.getDate() < 10 ? `0${day.getDate()}` : day.getDate()}`
    },

    /**
     * 生成接口验证所需ts和token
     * @param privateKey
     * @returns {*}
     */
    getTSAndToken(privateKey) {
        const ts = Date.now()
        const token = this.hash(`${this.hash(privateKey)}${ts}`)
        return { ts, token }
    },

    /**
     * md5 hash
     * @param target 原始字符串
     * @returns {*}
     */
    hash(target) {
        const md5 = crypto.createHash('md5')
        md5.update(target)
        return md5.digest('hex')
    },

    /**
     * hmac sign
     * @param target 原始字符串
     * @param key    加密密钥
     * @returns {string|String|*}
     */
    sign(target, key) {
        const hmac = crypto.createHmac('sha1', key)
        return hmac.update(target).digest().toString('base64')
    },

    /**
     * rsa sign
     * @param {string} target     原始字符串
     * @param {string} privateKey RSA私钥
     */
    rsaSign(target, privateKey) {
        const rsa = crypto.createSign('RSA-SHA1')
        rsa.update(target)
        return rsa.sign(privateKey, 'base64')
    },

    /**
     * rsa verify
     * @param {string} target    原始字符串
     * @param {string} signature 待校验签名
     * @param {string} publicKey RSA公钥
     */
    rsaVerify(target, signature, publicKey) {
        const rsa = crypto.createVerify('RSA-SHA1')
        rsa.update(target)
        return rsa.verify(publicKey, signature, 'base64')
    },

    /**
     * encryptAES
     * @param target 原始字符串
     * @param key    密钥
     * @returns {string|String|*}
     */
    encryptAES(target, key) {
        // console.log(crypto.getCiphers());
        return doCipher('aes256', key, target)
    },


    /**
     * decryptDES
     * @param encrypted 已经加密的字符串
     * @param key    密钥
     * @returns {string|String|*}
     */
    decryptDES(encrypted, key) {
        return doDecipher('des', key, encrypted)
    },


    /**
     * encryptDES
     * @param target 原始字符串
     * @param key    密钥
     * @returns {string|String|*}
     */
    encryptDES(target, key) {
        // console.log(crypto.getCiphers());
        return doCipher('des', key, target)
    },


    /**
     * decryptAES
     * @param encrypted 已经加密的字符串
     * @param key    密钥
     * @returns {string|String|*}
     */
    decryptAES(encrypted, key) {
        return doDecipher('aes256', key, encrypted)
    },

    /**
     * Get 请求方法
     * @param url request url
     * @param headers  request headers
     * @param outPutErrMsg http 请求错误时对于的错误返回
     * @param retryCount http重试次数
     * @returns string
     */
    fetchPlayDataFromWebByGET(url, headers, outPutErrMsg, retryCount) { // TODO:
        const startTimeInterval = Date.now()
        // if (retryCount === 0) {
        //     return reject(new Error(outPutErrMsg));
        // }
        // body = yield this.fetchPlayDataFromWebByGET(url, headers, outPutErrMsg, retryCount - 1);
        return new Promise((resolve, reject) => {
            request.get({
                url,
                headers,
                timeout: HTTP_REQUEST_REPONSE_BACK_TIMEOUT
            }, (error, response, body) => {
                console.log(`err is ${error}`)
                console.log(`response is ${response}`)
                console.log(`body is ${body}`)
                if (error || response.statusCode !== 200) {
                    const errMsg = response || 'response is null'
                    console.log(errMsg)
                    console.log(`request --> ${url}, cost: ${Date.now() - startTimeInterval}`)
                    return reject(new Error(outPutErrMsg))
                }
                console.log(`request --> ${url}, cost: ${Date.now() - startTimeInterval}`)
                return resolve(body)
            })
        })
    },

    /**
     * Post 请求方法
     * @param url request url
     * @param headers  request headers
     *  @param data post的数据
     * @param outPutErrMsg http 请求错误时对于的错误返回
     * @param retryCount http重试次数
     * @returns string
     */
    fetchPlayDataFromWebByPost(url, headers, data, outPutErrMsg, retryCount) {
        const startTimeInterval = Date.now()
        return new Promise((resolve, reject) => {
            const options = {
                url,
                method: 'POST',
                headers,
                json: true,
                body: data
            }
            request(options, callback)
            function callback(error, response, data) {
                console.log(`err is ${error}`)
                console.log(`response is ${response}`)
                console.log(`body is ${data}`)
                if (error || response.statusCode !== 200) {
                    const errMsg = response || 'response is null'
                    console.log(errMsg)
                    console.log(`request --> ${url}, cost: ${Date.now() - startTimeInterval}`)
                    return reject(new Error(outPutErrMsg))
                }
                console.log(`request --> ${url}, cost: ${Date.now() - startTimeInterval}`)
                return resolve(data)
            }
        })
    },

    /**
     * 删除输出多余的键值对
     * @param keys
     * @param  data
     * @returns {json}
     */
    deleteReturnDataForKeys(keys, data) {
        try {
            Object.keys(data).forEach((dataKey) => {
                keys.forEach((key) => {
                    if (dataKey === key) {
                        data[dataKey] = undefined
                    }
                })
            })
            return data
        } catch (e) {
            console.log(e.message)
        }
    },

    /**
     * 根据平台类型获取不同格式的返回数据
     * @param platform
     * @param  allowPlatforms
     * @param  data
     * @returns {json}
     */
    getReturnDataByPlatform(platform, allowPlatforms, data) {
        try {
            if (_.indexOf(allowPlatforms, platform) === -1) {
                return data
            }
            if (_.isArray(data)) {
                data = { array: data }
            }
            return getLastData(data)
        } catch (e) {
            console.log(e.message)
        }
    },

    // xmlToJsonForPromise(xmlObject) {
    //     return new Promise((resolve, reject) => {
    //         parseString(xmlObject, (err, result) => {
    //             if (err) {
    //                 return reject(new Error('xml 解析失败,请确保上传的数据是xml'))
    //             }
    //             return resolve(result)
    //         })
    //     })
    // },

    /**
     * generate vod filename on the basis of dedicated biz type
     * @param {string} bizType      biz type
     * @param {number} liveID       live ID of core api
     * @param {string} streamName   name of the target stream
     */
    genVodFilename(bizType, liveID, streamName) {
        return `${bizType}-${moment().format('YYMMDDHHmmss')}-${liveID}-${streamName}`
    },
}


/**
 *
 * @param data
 * @returns {json}
 */
const getLastData = function (data) {
    // if(_.isArray(data) ) {
    //     data = {array: data};
    // }
    const keys = _.keys(data)
    keys.forEach((key) => {
        let value = data[key]
        if (_.isArray(value)) {
            if (value.length === 0) {
                // {data:[]} --> {data:{array:[]}}
                // value = {array: value}  //TODO: 没有想清楚
            } else if (!_.isObject(value[0]) && !_.isArray(value[0])) {
                // ["val1", "val2"] --> [{ "key" : "val1" },{ "key" : "val2" }]
                value = addKeyForArrElement(value)
            } else {
                // object or array
                value = getLastData(value)
            }
        } else if (_.isObject(value)) {
            // 向下走
            value = getLastData(value)
        }
        data[key] = value
    })

    return data
}
/**
 * ["val1", "val2"] --> [{ "key" : "val1" },{ "key" : "val2" }]
 * @param array
 * @returns {json}
 */
const addKeyForArrElement = function (array) {
    const returnArray = []
    array.forEach((val) => {
        returnArray.push({ key: val })
    })
    return returnArray
}


// 加密
function doCipher(algorithm, password, word) {
    const cipher = crypto.createCipher(algorithm, password)
    let encrypted = cipher.update(word, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}

// 解密
function doDecipher(algorithm, password, encrypted) {
    const decipher = crypto.createDecipher(algorithm, password)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
