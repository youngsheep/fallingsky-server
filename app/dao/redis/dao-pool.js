var _poolModule = require('generic-pool');

/*
 * Create redis connection pool.
 */
var createRedisPool = function(app) {
	var redisConfig = app.get('redis');
	return _poolModule.Pool({
		name: 'redis',
		create: function(callback) {
			var redis = require('redis');
			var client = redis.createClient(redisConfig.port, redisConfig.host);
			callback(null, client);
		},
		destroy: function(client) {
		    client.quit(function (err, res) {
                        console.log("Redis client Exiting from quit command.");
                    });
		},
		max: 10,
		idleTimeoutMillis : 300000,
		log : false
	});
};

exports.createRedisPool = createRedisPool;
