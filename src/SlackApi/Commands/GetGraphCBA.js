
const AbstractSlackApiCommands = require('./AbstractSlackApiCommands');
GetGraphCBA.prototype = new AbstractSlackApiCommands();

/**
 * Verification for Event Url
 *
 * @param params
 * @constructor
 */
function GetGraphCBA(params)
{
    const self = this;
    this.run = function() {
        return new Promise(function(resolve, reject) {
            let chart = new self.cl.Service.ChartGenerator(params.text);
            chart.init().then(function(chartData){
                new self.cl.SlackApi.Messages.SendGraph(chart, params).send(chartData);
                resolve('');
            }, function(){
                resolve('oOops or something went wrong!');
            });
        });
    };
}

module.exports = GetGraphCBA;