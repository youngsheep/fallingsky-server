
module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    if(!this.app)
        logger.error(app);
};

Handler.prototype.regsiter = function(msg, session, next) {
    var self = this;
    var data = {};
    data.username = msg.head.username;
    data.nickname = msg.nickname;
    data.portrait = "http://";
    userDao.createPlayer(data.username,data,function(err){
        if(!err){
            var player = self.app.playerMgr.getPlayerById(session.uid);
            if(!player){
                player = self.app.playerMgr.addPlayer(session.uid,data.username,session.fontendId);
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
    var player = this.app.playerMgr.getPlayerByName(msg.head.username);
    if(!player || player.uid !== session.uid){
        next(null,{result:-1},null);
        return;
    } 

    var uid = {uid:session.uid,sid:player.fid };
    var data = {nickname:player.nickname,portrait:player.portrait};
    this.app.get('channelService').pushMessageByUids('roleBaseInfo', data, [uid] , null);

    next(null,{result:0},null);
};
