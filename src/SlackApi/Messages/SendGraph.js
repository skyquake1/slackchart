
const moment = require('moment');
const AbstractSlackApiMessages = require('./AbstractSlackApiMessages');
Report.prototype = new AbstractSlackApiMessages();

/**
 * Send Report
 * reportData
 * @constructor
 */
function Report(chart, params)
{
    const self = this;

    this.send = function()
    {
        return self.chatPostMessage({
            text: `Chart: ${params.text.toUpperCase()}`,
            as_user:  false,
            "channel": params.channel_id,
        }, [{
            "title": "",
            "text": "",
            "image_url": chart.getImageUrl(),
        }]);
    }
}

module.exports = Report;
