var pomelo = require('pomelo');
var RandomMatchService = require('../../../service/randomMatchService');
var userDao = require('../../../dao/userDao');
var battleMgr = require('../../../domain/battle/battlemgr');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    if(!this.app)
        logger.error(app);
};

Handler.prototype.start = function(msg, session, next){
    RandomMatchService.add(session.uid,function(matchid){
        if(matchid !== -1)
        {
            var oppsessions = this.app.get("sessionService").getByUid(matchid);
            if(oppsessions.length == 0){
            }
            oppsession = oppsessions[0];

            var battle = battleMgr.createBattle(session.uid,matchid);
            oppsession.set("battleid",battle.id);
            session.set("battleid",battle.id);

            var data1 = {
                result : 0,
                battleid : battle.id,
                oppId: matchid,
                oppName : oppsession.get("username")
            };
            next(null,data1,null);

            var uid = {uid:matchid,sid: 'connector-server-'+oppsession.get('serverId') };
            console.log(uid);

            var data2 = {
                result : 0,
                battleid : battle.id,
                oppId: session.uid,
                oppName : session.get("username")
            };
            pomelo.app.get('channelService').pushMessageByUids('battle.battleHandler.start', data2, [uid] , null);
        }
        else
        {
            next(null,{result:100},null);
        }
    });   
};

Handler.prototype.cmd = function(msg, session, next){
    if(msg.battleid !== session.get('battleid')){
        next(null,{result:-1,clearLines:[]},null);
    }

    var battle = battleMgr.getBattleById(msg.battleid);
    if(!battle){
        next(null,{result:-2,clearLines:[]},null);
    }
   
    var bm = battle.getMemberByUid(session.uid);
    if(bm && bm.fillBlock(msg.xPos,msg.yPos,msg.rotateFlag)){
        bm.generateBlock();
        next(null,{result:0,clearLines:[],nextType:bm.curBlockType},null);

        var oppsessions = this.app.get("sessionService").getByUid(matchid);
        if(oppsessions.length == 0){
        }
        oppsession = oppsessions[0];

        var uid = {uid:bm.oppid,sid: 'connector-server-'+oppsession.get('serverId') };
        console.log(uid);

        var data = {
            blockXPos : msg.xPos,
            blockYPos : msg.yPos,
            blockFlag: msg.rotateFlag,
            nextType : bm.curBlockType
        };
        pomelo.app.get('channelService').pushMessageByUids('oppstate', data, [uid] , null);        
    }
    else
    {
        next(null,{result:-3,clearLines:[]},null);
    }
}
