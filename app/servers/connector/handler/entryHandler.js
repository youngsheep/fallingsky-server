var userDao = require('../../../dao/userDao');
var async = require('async');

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

    console.log("session id : " + session.uid);
    if(!!session.uid){
        var data = {
            result : rescode['result success'],
            playerid : session.uid
        };
        next(null,data,null);
        return;
    }
    else{
        if(!msg.username){
            console.log("proto param err");
            var data = {
                result : rescode['svr err'],
                playerid : 0
            };
            next(null,data,null); 
            return;
        }        
    }

    
    var self = this;
    var playerid = parseInt(this.serverId + id, 10);
    id += 1;
    
    session.bind(playerid);
    session.set('serverId', this.serverId);
    var data = {
        result : rescode['result success'],
        playerid : playerid
    };

    var player = this.app.playerMgr.createPlayer(playerid,msg.username,this.serverId);
    console.log(this.app.playerMgr.idMap);

    async.waterfall( [
        function ( cb ){
            userDao.getPlayerAllBaseInfo( msg.username, cb );
        },
        function (res,cb){
            if(res.username === msg.username){
                console.log("get user res : ");
                console.log(res);
                player.loadBaseInfo(res);
                session.set('username', msg.username);
                session.set('token',msg.token);
                next(null,data,null);
                return;
            }
            else{
                var info = {};
                info.username = msg.username;
                info.token = msg.token;
                player.loadBaseInfo(info);
                userDao.createPlayer(msg.username,info,cb); 
            }
        },
        function (cb) { 
            session.set('username', msg.username);
            session.set('token',msg.passwd);
            cb(null);
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

