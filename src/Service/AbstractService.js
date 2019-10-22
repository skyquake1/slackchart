
const Abstract = require('../Abstract');
AbstractService.prototype = new Abstract();

function AbstractService() { }
module.exports = AbstractService;
