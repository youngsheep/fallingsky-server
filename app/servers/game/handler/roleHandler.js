var userDao = require('../../../dao/userDao');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    if(!this.app)
        logger.error(app);
};

Handler.prototype.register = function(msg, session, next) {
    if(!msg.head.uid){
        next(null,{result:-2},null);
        return;
    }
    var self = this;
    var data = {};
    data.uid = msg.head.uid;
    data.nickname = msg.nickname;
    userDao.createPlayer(data.uid,data,function(err){
        if(!err){
            var player = self.app.playerMgr.getPlayerByPid(session.uid);
            if(!player){
                player = self.app.playerMgr.addPlayer(session.uid,data.uid,session.fontendId);
            }
            player.loadBaseInfo(data);
            next(null,{result:0},null);
        }
        else{
            next(null,{result:-2},null);
        }
    }); 
};

Handler.prototype.info = function(msg, session, next) {
    var player = this.app.playerMgr.getPlayerByUid(msg.head.uid);
    console.log(player);
    if(!player || player.pid !== session.uid){
        next(null,{result:-1},null);
        return;
    } 

    var uid = {uid:session.uid,sid:player.fid };
    var data = {nickname:player.nickname,portrait:player.portrait};
    this.app.get('channelService').pushMessageByUids('roleBaseInfo', data, [uid] , function(){
        next(null,{result:0},null);    
    });
};
