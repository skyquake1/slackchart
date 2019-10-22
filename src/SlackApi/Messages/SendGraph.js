
const moment = require('moment');
const AbstractSlackApiMessages = require('./AbstractSlackApiMessages');
Report.prototype = new AbstractSlackApiMessages();

/**
 * Send Report
 * reportData
 * @constructor
 */
function Report(chart, channel)
{
    const self = this;

    this.send = function()
    {
        return self.chatPostMessage({
            text:  'Commonwealth Bank Of Australia',
            "channel": channel,
        }, [{
            "title": "",
            "text": "",
            "image_url": chart.getImageUrl(),
        }]);
    }
}

module.exports = Report;
