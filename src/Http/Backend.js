
const AbstractHttp = require('./AbstractHttp');
const express = require('express');
Backend.prototype = new AbstractHttp();

function Backend(app)
{
    const self = this;
    /**
     * initiation Backend HTTP server routes
     */
    this.init = function() {
        app.use('/', express.static('static-backend/'));
    };
}

module.exports = Backend;
