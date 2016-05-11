"use strict";

/*
 * Environment variables and application configurations.
 */

var path = require('path'),
    _ = require('lodash');

var baseConfig = {
    app : {
        root: path.normalize(__dirname+ '/../..'),
        env: process.env.NODE_ENV,
        secret: 'I am a secret key',
        pass: process.env.PASS || 'pass',
        viewDir: path.join(__dirname,'..','views')
    }
};

// environment specific config overrides
var platformConfig = {
    development: {
        app: {
            port: 3000
        },
        mongo: {
            url: 'mongodb://localhost:27017/login-dev'
        }
    },
    test: {
        app: {
            port: 3001
        },
        mongo: {
            url: 'mongodb://localhost:27017/login-test'
        }
    },
    production: {
        app: {
            port: process.env.PORT || 3000,
            cacheTime: 7*24*60*60*1000
        },
        mongo: {
            url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/koan'
        }
    }
};

// merge and override the base configuration with the platform specific values

module.exports = _.merge(baseConfig, platformConfig[baseConfig.app.env || (baseConfig.app.env = 'development')]);
