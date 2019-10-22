
const AbstractSlackApi = require('../AbstractSlackApi');
AbstractSlackApiCommands.prototype = new AbstractSlackApi();

function AbstractSlackApiCommands() { }
module.exports = AbstractSlackApiCommands;


