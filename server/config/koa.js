'use strict';

const fs = require('fs'),
    logger = require('koa-logger'),
    route = require('koa-route'),
    send = require('koa-send'),
    cors = require('koa-cors'),
    compress = require('koa-compress'),
    bodyParser = require('koa-bodyparser'),
    xtplApp = require('xtpl/lib/koa'),
    config = require('./config');

module.exports = function (app) {

    if (config.app.env !== 'test') {        
        app.use(logger());
    }

    app.use(cors({
        maxAge: config.app.cacheTime / 1000,
        credentials: true,
        methods: 'GET, HEAD, OPTIONS, PUT, POST, DELETE',
        headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }));
    
    app.use(compress({
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
    }));

    app.use(bodyParser());

    xtplApp(app,{
        //配置模板目录
        views: config.app.viewDir
    });

    var sendOpts = config.app.env === 'production' ? {root: 'public', maxage: config.app.cacheTime} : {root: 'public'};
    app.use(function *(next) {
        if (yield send(this, this.path, sendOpts)) {

            // file exists and request successfully served so do nothing
            return;
        } else if (this.path.indexOf('.') !== -1) {

            // file not exist so do nothing and koa return a 404 by default
            // we treat any path with a dot in it as a request for a file
            return;
        } else {
            // request is not for a file so go to next.
            // request is for a subdirectory so treat it as an angular route and serve index.html, letting angular handle the routing properly
            yield send(this, '/index.html', sendOpts);
        }
    });
};
