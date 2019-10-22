
const Abstract = require('../Abstract');
AbstractHttp.prototype = new Abstract();

function AbstractHttp() { }
module.exports = AbstractHttp;

/**
 * Make 200 http-response
 * @param res
 * @param msg
 */
AbstractHttp.prototype.ok = function(res, msg) {
    msg = msg || ''==msg ? msg : 'Ok';

    if ('string' !== typeof msg) {
        msg = JSON.stringify(msg);
    }
    res.status(200).end(msg);
};

/**
 * Make Error http-response
 * @param res
 * @param msg
 * @param status
 */
AbstractHttp.prototype.err = function(res, msg, status) {
    status = status || 400;
    res.status(status).end(msg);
};


