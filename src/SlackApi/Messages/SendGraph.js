
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

    this.send = function(chartData)
    {
        return self.chatPostMessage({
            text: (params.user_id ? `<@${params.user_id}> - `:'') + `Chart: ${params.text.toUpperCase()}`,
            // as_user:  false,
            "channel": params.channel_id,
        }, [{
            "title": "",
            "text": "",
            //"footer": 'Closed: ' + chartData.prevDay.date + ' $'+ chartData.prevDay.price,
            "image_url": chart.getImageUrl(),
        }]);
    }
}

module.exports = Report;
