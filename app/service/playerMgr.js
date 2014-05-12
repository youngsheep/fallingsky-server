var Player = require('../domain/entity/player');

var PlayerMgr = function(max){
    this.maxPlayer = max;
    this.idMap = {};
    this.usernameMap = {};
};

module.exports = PlayerMgr;

PlayerMgr.prototype.createPlayer = function(uid,username,sid){
    var player = new Player(uid,username,sid);
    this.idMap[uid] = player;
    this.usernameMap[username] = player;
    return player;
};

PlayerMgr.prototype.getPlayerByID = function(id){
    return this.idMap[id];
};

PlayerMgr.prototype.getPlayerByName = function(username){
    return this.usernameMap[username];
};


