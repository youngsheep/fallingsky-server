var userDao = require('../../../dao/userDao');

module.exports = function(app) {
	return new LoginRemote(app, app.get('playerMgr'));
};

var LoginRemote = function(app, playerMgr) {
	this.app = app;
	this.playerMgr = playerMgr;
};

/**
 *	Add player into channel
 */
LoginRemote.prototype.login = function(info, cb) {
    userDao.getPlayerAllBaseInfo( info.username, function(err,res){
        var data = res;

        console.log(info);
        if(!err){
            if(!res){
                //TODO player creating need to generate handler
                data = {};
                data.username = "aaa";
                data.nickname = "yy";
                data.portrait = "http://";
                userDao.createPlayer(data.username,info,null);

                data = info;
            }

            var player = this.playerMgr.addPlayer(info.uid,info,username,info.sid);
            player.loadBaseInfo(data);
        }

        cb(err);
    });
};

/**
 * leave Channel
 * uid
 * channelName
 */
LoginRemote.prototype.leave =function(uid, channelName, cb){
	this.chatService(uid, channelName);
	cb();
};

/**
 * kick out user
 *
 */
LoginRemote.prototype.kick = function(uid, cb){
	this.chatService.kick(uid);
	cb();
};
