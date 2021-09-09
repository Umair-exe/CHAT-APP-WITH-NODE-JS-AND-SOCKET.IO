const moment = require('moment');

function messageFormat(username,msg) {
    return {
        username: username,
        msg: msg,
        time: moment().format('h:mm a')
    }
}

module.exports= messageFormat;