var Player = require('../domain/entity/player');
var utils = require('../util/utils');

var PlayerMgr = function(max){
    this.maxPlayer = max;
    this.idMap = {};
    this.usernameMap = {};
};

module.exports = PlayerMgr;

PlayerMgr.prototype.addPlayer = function(uid,username,sid){
    var player = new Player(uid,username,sid);
    this.idMap[uid] = player;
    this.usernameMap[username] = player;

    utils.myPrint("addPlayer -- idmap :",this.idMap, "  username :",this.usernameMap);
    return player;
};

PlayerMgr.prototype.removePlayer = function(uid){
    if(this.idMap[uid]){
        var name = this.idMap[uid].username;
        delete this.idMap[uid];
        delete this.usernameMap[name];
        utils.myPrint("removePlayer -- idmap :",this.idMap, "  username :",this.usernameMap);
    }
    utils.myPrint("uid ",uid);
};

PlayerMgr.prototype.getPlayerByID = function(id){
    return this.idMap[id];
};

PlayerMgr.prototype.getPlayerByName = function(username){
    return this.usernameMap[username];
};


