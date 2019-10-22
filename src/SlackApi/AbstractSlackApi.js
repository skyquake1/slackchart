
const axios = require('axios');
const request = require('request');
const qs = require('querystring');

const Abstract = require('../Abstract');
AbstractSlackApi.prototype = new Abstract();

function AbstractSlackApi() { }
module.exports = AbstractSlackApi;

/**+
 * Functionality for sending prepared data to the https://slack.com/api
 * @param url
 * @param message
 * @returns {Promise}
 */
AbstractSlackApi.prototype.sendApi = function(url, message) {
    const self = this;
    return new Promise(function(resolve, reject) {

        if ('http' == url.substr(0, 4)) {
            message.replace_original = true;
            var postOptions = {
                uri: url,
                method: 'POST',
                headers: { 'Content-type': 'application/json; charset=utf-8' },
                json: message
            };
            request(postOptions, (error, response, body) => {
                if (error){
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        } else {
            if (!message.token && !message.client_secret) {
                message.token = process.env.SLACK_ACCESS_TOKEN;
            }
            axios.post(`https://slack.com/api/${url}`, qs.stringify(message)).then(resolve).catch(reject);
        }
    });
};
