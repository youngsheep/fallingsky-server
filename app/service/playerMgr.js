var Player = require('../domain/entity/player');
var utils = require('../util/utils');

var PlayerMgr = function(max){
    this.maxPlayer = max;
    this.uidMap = {};
    this.pidMap = {};
};

module.exports = PlayerMgr;

PlayerMgr.prototype.addPlayer = function(pid,uid,sid){
    var player = new Player(pid,uid,sid);
    this.uidMap[uid] = player;
    this.pidMap[pid] = player;

    utils.myPrint("addPlayer -- idmap :",this.uidMap, "  username :",this.pidMap);
    return player;
};

PlayerMgr.prototype.removePlayer = function(pid){
    if(this.pidMap[pid]){
        var uid = this.pidMap[pid].uid;
        delete this.uidMap[uid];
        delete this.pidMap[pid];
        utils.myPrint("removePlayer -- idmap :",this.uidMap, "  username :",this.pidMap);
    }
    utils.myPrint("uid ",uid);
};

PlayerMgr.prototype.getPlayerByUid = function(uid){
    return this.uidMap[uid];
};

PlayerMgr.prototype.getPlayerByPid = function(pid){
    return this.pidMap[pid];
};


