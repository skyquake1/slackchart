
const AbstractSlackApi = require('../AbstractSlackApi');
AbstractSlackApiMessages.prototype = new AbstractSlackApi();

function AbstractSlackApiMessages() { }
module.exports = AbstractSlackApiMessages;

/**
 * add initial data
 * @param data
 * @returns {AbstractSlackApiMessages}
 */
AbstractSlackApiMessages.prototype.init = function(data) {
    this._data = data;
    return this;
};

/**
 * setter for data
 * @param name
 * @param value
 * @returns {AbstractSlackApiMessages}
 */
AbstractSlackApiMessages.prototype.setData = function(name, value) {
    if(!this._data) {
        this._data = {};
    }
    this._data[name] = value;
    return this;
};
/**
 * getter for data
 * @param name
 * @returns {*|boolean}
 */
AbstractSlackApiMessages.prototype.getData = function(name) {
    return this._data && this._data[name] ? this._data[name] : false ;
};



AbstractSlackApiMessages.prototype.chatPostMessage = function(msg, attachments){
    let self = this;
    return new Promise(function(resolve, reject) {
        let message ='string' == typeof msg ? { "text": msg } : msg;

        if (attachments) {
            message.attachments = JSON.stringify(attachments)
        }

        let urlName = self.getData('response_url') || 'chat.postMessage';

        if(!message.token) {
            //message.token = self.getData('token');
            message.token = process.env.SLACK_ACCESS_TOKEN;
        }

        if(!message.channel) {
            message.channel = self.getData('channel');
        }

        if(self.getData('ts')) {
            urlName = 'chat.update';
            message.ts = self.getData('ts');
        }

        self.sendApi(urlName, message).then((result) => {
            if ('ok' == result) {
                resolve({});
                return;
            }

            if (result.data.ok) {
                resolve(result.data);
                return;
            }
            console.log( 'message', message );
            console.error(result.data);
        }).catch(reject);
    });
};