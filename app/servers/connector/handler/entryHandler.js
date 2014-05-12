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
    var rescode = this.app.get('resCode');
    
    var self = this;
    var data = null;

    var playerid = parseInt(this.serverId + id, 10);
    id += 1;
    
    session.bind(playerid);
    session.set('serverId', this.serverId);
    data = {
        result : rescode['result success'],
        playerid : playerid
    };

    async.waterfall( [
        //TODO need auth rpc
        function ( cb ){
            self.app.rpc.game.loginRemote.login(session,{uid:playerid, username:msg.username, sid:self.serverid}, cb);
        }
        ],
        function ( err ) { 
            if(err){
                 console.error("error message - " + err);
                 next(null,{result : rescode['svr err'], playerid:0});
                 return;
            }
            console.log("enter sucess!");
            next(null,data,null);
        }
    );

    console.log("entry end!");
};

