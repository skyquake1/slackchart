
const express = require('express');
const bodyParser = require('body-parser');

const Abstract = require('./Abstract');
const SlackApi = require('./SlackApi');
const Service = require('./Service');
const Http = require('./Http');

/**
 * Services registration
 * @type {{Http: *, SlackApi: * }}
 */
Abstract.prototype.cl = {
    SlackApi,
    Http,
    Service,
};

/**
 * Start running app listeners
 */
function bootstrap() {
    //Apply front http listener
    const appFront = express();
    appFront.use(bodyParser.json());
    bodyParser.text();
    appFront.listen(process.env.HTTP_FRONT_PORT, function(){
        console.log('HTTP Front listener running on', process.env.HTTP_FRONT_PORT);
    });
    new Http.Front(appFront).init();


    //Apply Backend http listener
    const appBackend = express();
    appBackend.listen(process.env.HTTP_BACKEND_PORT, function(){
        console.log('HTTP Backend listener running on', process.env.HTTP_BACKEND_PORT);
    });
    new Http.Backend(appBackend).init();

    new Service.GarbageCollector().init();
}

module.exports = {
    bootstrap:bootstrap
};

