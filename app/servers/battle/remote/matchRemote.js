var RandomMatchService = require('../../../service/randomMatchService');

module.exports = function(app) {
    return new MatchRemote(app, new RandomMatchService(app));
};

var MatchRemote = function(app, matchService) {
    this.app = app;
    this.matchService = matchService;
};

MatchRemote.prototype.RandomAdd = function(uid){
    this.matchService.add(uid,function(matchid){
         if(matchid != -1)
         {
             var msg = {first:uid,second:matchid,errstr:'match sucess!'};
             this.app.get('channelService').pushMessageByUids('onMatch', msg, [{uid: uid, sid: uid}], null);
             this.app.get('channelService').pushMessageByUids('onMatch', msg, [{uid: matchid, sid: matchid}], null);
         }
    });
};
