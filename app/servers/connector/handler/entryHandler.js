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
    console.log(this.serverId);

    var self = this;
    var playerid = parseInt(this.serverId + id, 10);
    id += 1;
    
    session.bind(playerid);
    session.set('serverId', this.serverId);
    var data = {
        result:100,
        playerid:playerid
    };

    async.waterfall( [
        function ( cb ){
            userDao.getUserByName( msg.username, cb );
        },
        function (res,cb){
            if(!!res){
                console.log("get user res : "+ res);
                session.set('username', msg.username);
                session.set('passwd',msg.passwd);
                next(null,data,null);
                return;
            }
            else{
               userDao.createUser(msg.username,msg.passwd,cb); 
            }
        },
        function (cb) { 
            session.set('username', msg.username);
            session.set('passwd',msg.passwd);
            cb(null);
        }
        ],
        function ( err ) { 
            if(err){
                 console.error("error message - " + err);
                 next(null,{result:200});
                 return;
            }
            console.log("enter sucess!");
            next(null,data,null);
        }
    );

    console.log("entry end!");
};

