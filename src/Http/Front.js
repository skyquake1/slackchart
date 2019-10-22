
const bodyParser = require('body-parser');
const express = require('express');
const AbstractHttp = require('./AbstractHttp');
Front.prototype = new AbstractHttp();

function Front(app)
{
    const self = this;
    const urlencodedParser = bodyParser.urlencoded({ extended: false });

    /**
     * Default http route
     * @param req
     * @param res
     */
    async function defaultRoute(req, res){
        self.ok(res);
    }

    /**
     * Controller for Slack commands
     * @param req
     * @param res
     */
    async function commands(req, res) {
        if (!req.body || req.body.token != process.env.SLACK_VERIFICATION_TOKEN) {
            self.err(res, 'Bad Verification token', 500);
            return null;
        }

        if(!req.params || !req.params.type) {
            self.err(res, 'CallbackId type does not exists', 500);
            return null;
        }

        let type = self.toCamelCase(req.params.type);
        if (!self.cl.SlackApi.Commands[type]) {
            self.err(res, 'Command processor does not exists', 500);
            return null;
        }

        let response = ' ';

        try {
            const commandsProcessor = new self.cl.SlackApi.Commands[type](req.body);
            response = await commandsProcessor.run();
        } catch (err){
            self.log.error('Action Error', err);
            self.err(res, 'Action Error', 400);
            return null;
        }
        self.ok(res, response);
    }

    /**
     * initiation Front HTTP server routes
     */
    this.init = function() {
        app.get('/', defaultRoute);
        app.post('/commands/:type', urlencodedParser, commands);
        app.use('/static', express.static('static/'));
    };
}

module.exports = Front;
