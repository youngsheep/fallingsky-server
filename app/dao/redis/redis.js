//
var redisclient = module.exports;

var _pool;

var NND = {};

/*
 * Init sql connection pool
 * @param {Object} app The app for the server.
 */
NND.init = function(app){
	_pool = require('./dao-pool').createRedisPool(app);
};

/**
 * Close connection pool.
 */
NND.shutdown = function(){
	_pool.destroyAllNow();
};

/**
 * init database
 */
redisclient.init = function(app) {
	if (!!_pool){
		return redisclient;
	} else {
		NND.init(app);
		return redisclient;
	}
};

redisclient.execute = function(callback) {
    _pool.acquire(function(err, client) {
		if (!!err) {
			console.error('[sqlqueryErr] '+err.stack);
			return;
		}
        
        callback(client,function(){
            _pool.release(client);
        });
	});  
}
/**
 * shutdown database
 */
redisclient.shutdown = function(app) {
	NND.shutdown(app);
};




