var async = require('async');
var utils = require('../../../util/utils');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  this.serverId = app.get('serverId').split('-')[2];
};

// generate playerId
var id = 1;

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
    if(!msg.head.uid){
        next(null,{result:-2},null);
        return;
    }

    var rescode = this.app.get('resCode');
    
    var self = this;

    var playerid = parseInt(this.serverId + id, 10);
    id += 1;
    
    session.bind(playerid);
    session.set('serverId', this.serverId);
    var data = {
        result : rescode['result success'],
        pid : playerid
    };

    async.waterfall( [
        function ( cb ){
            self.app.rpc.weibo.authRemote.auth(session,{token:msg.token, uid:msg.head.uid}, cb);
        },        
        function ( userinfo, cb ){
            data.nickname = userinfo.nickname;
            self.app.rpc.game.loginRemote.login(session,
                {pid:playerid, uid:msg.head.uid, fid:session.frontendId , data:userinfo}, cb);
        },
        function( result , cb){
            data.result = result;
            next(null,data,null);

            session.on('closed', onUserLeave.bind(null, self.app));
            return;
        }
        ],
        function ( err ) { 
            if(err){
                 utils.myPrint("error message - " , err);
                 next(null,{result : rescode['svr err']});
                 return;
            }
            utils.myPrint("enter sucess!");
            next(null,data,null);
        }
    );
};

var onUserLeave = function (app, session, reason) {
	if(!session || !session.uid) {
		return;
	}

	utils.myPrint('1 ~ OnUserLeave is running ...');
	app.rpc.game.loginRemote.leave(session,session.uid, function(err){
		if(!!err){
			logger.error('user leave error! %j', err);
		}
	});
};

