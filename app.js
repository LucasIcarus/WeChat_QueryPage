const config = require('./server/config/config'),
    koaConfig = require('./server/config/koa'),
    co = require('co'),
    koa = require('koa'),
    route = require('koa-route'),
    app = koa();

module.exports = app;

app.init = co.wrap(function *() {
    
    koaConfig(app);
    
    app.server = app.listen(config.app.port);

    if (config.app.env !== 'test') {
        console.log('KOA listening on port ' + config.app.port);
    }
});

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
    app.init().catch(function (err) {
        console.error(err.stack);
        process.exit(1);
    });
}
    
