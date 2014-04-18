var pomelo = require('pomelo');
var sync = require('pomelo-sync-plugin');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'hello');

// configure for global
app.configure('production|development', function() {
    app.loadConfig('redis', app.getBase() + '/config/redis.json');
    app.loadConfig('resCode',app.getBase()+'/share/config/resCode.json');
    app.filter(pomelo.filters.timeout());
});

// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 30,
			//useDict : true,
			useProtobuf : true,
                        handshake : function(msg, cb){
                                        console.log("handshake"+msg);
				        cb(null, {});
                                    }
		});
});

// Configure redis
app.configure('production|development', 'connector|master', function() {
	var redisClient = require('./app/dao/redis/redis').init(app);
	app.set('dbclient', redisClient);
    app.use(sync, {sync: {path:__dirname + '/app/dao/mapping', dbclient: redisClient}});
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
