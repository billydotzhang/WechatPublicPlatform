const xml2js = require('xml2js');

module.exports = {
    async parseXMLAsync(xml) {
        return new Promise(function (resolve, reject) {
            xml2js.parseString(xml, { trim: true }, function (err, content) {
                err ? reject(err) : resolve(content);
            })
        });
    },
    xml2jsObj: function(jsObj){
        const builder = new xml2js.Builder()
        return builder.buildObject(jsObj)
    },
    // 多维数组转化为单数组
    formatMessage: function (result) {
        var message = {};
        if (typeof result === 'object') {
            var keys = Object.keys(result);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var item = result[key];
                if (!(item instanceof Array) || item.length === 0) continue;
                if (item.length === 1) {
                    var val = item[0];
                    if (typeof val === 'object') message[key] = formatMessage(val);
                    else message[key] = (val || '').trim();
                } else {
                    message[key] = [];
                    for (var j = 0, k = item.length; j < k; j++) message[key].push(formatMessage(item[j]));
                }
            }
        }
        return message;
    }
}