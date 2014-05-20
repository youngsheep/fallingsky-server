var userDao = require('../../../dao/userDao');
var utils = require('../../../util/utils');

module.exports = function(app) {
	return new LoginRemote(app);
};

var LoginRemote = function(app) {
	this.app = app;
};

LoginRemote.prototype.login = function(info, cb) {
    utils.myPrint(info);
    var self = this;
    userDao.getPlayerAllBaseInfo( info.username, function(err,res){
        var data = res;

        if(!err){
            var player = self.app.playerMgr.addPlayer(info.uid,info.username,info.fid);            
            if(!res){
                //if need auto register new player,write here
                cb(null,100);
            }
            else{

                player.loadBaseInfo(data);
                cb(null,0);
            }
        }
        else{
            cb(err);
        }
    });
};

/**
 * leave Channel
 * uid
 * channelName
 */
LoginRemote.prototype.leave =function(uid, cb){
    this.app.playerMgr.removePlayer(uid);
    cb();
};

