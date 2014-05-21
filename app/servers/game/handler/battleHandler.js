var pomelo = require('pomelo');
var userDao = require('../../../dao/userDao');
var utils = require('../../../util/utils');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    if(!this.app)
        logger.error(app);
};

Handler.prototype.start = function(msg, session, next) {
    var matchid = utils.randMatch(session.uid); 
    if(matchid !== -1)
    {
        var oppPlayer = this.app.playerMgr.getPlayerByPid(matchid);
        var player = this.app.playerMgr.getPlayerByPid(session.uid);

        var battle = this.app.battleMgr.createBattle(session.uid,matchid);
        oppPlayer.battleid = battle.id;
        player.battleid = battle.id;

        var bm = battle.getMemberByUid(session.uid);
        bm.generateBlock();
        var data1 = {
            result : 0,
            battleid : battle.id,
            oppId: matchid,
            oppName : oppPlayer.nickname,
            firstBlock : bm.curBlockType
        };
        next(null,data1,null);

        var uid = {uid:matchid,sid: oppPlayer.fid};
        console.log(uid);

        var oppbm = battle.getMemberByUid(matchid);
        oppbm.generateBlock();
        var data2 = {
            result : 0,
            battleid : battle.id,
            oppId: session.uid,
            oppName : player.nickname,
            firstBlock : oppbm.curBlockType
        };
        this.app.get('channelService').pushMessageByUids('game.battleHandler.start', data2, [uid] , null);
    }
    else
    {
        next(null,{result:100},null);
    }    
};

Handler.prototype.cmd = function(msg, session, next){

    var battle = this.app.battleMgr.getBattleById(msg.battleid);
    if(!battle){
        next(null,{result:-2,clearLines:[]},null);
        return;
    }
    
    var player = this.app.playerMgr.getPlayerByPid(session.uid);
    var bm = battle.getMemberByUid(session.uid);

    if(!player || !bm ){
        next(null,{result:-1,clearLines:[]},null);
    }

    var oppid = bm.oppid;
    var oppPlayer = this.app.playerMgr.getPlayerByPid(oppid);

    if(bm && bm.fillBlock(msg.xPos,msg.yPos,msg.rotateFlag)){
        bm.generateBlock();

        var uid = {uid:bm.oppid,sid: oppPlayer.fid };
        console.log(uid);

        var data = {
            blockXPos : msg.xPos,
            blockYPos : msg.yPos,
            blockFlag: msg.rotateFlag,
            nextType : bm.curBlockType
        };
        this.app.get('channelService').pushMessageByUids('oppstate', data, [uid] , null);        

        next(null,{result:0,clearLines:[],nextType:bm.curBlockType},null);
    }
    else
    {
        next(null,{result:-3,clearLines:[]},null);
    }
};
