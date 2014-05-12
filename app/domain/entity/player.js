var Player = function(uid,username,sid){
    this.username = username;
    this.uid = uid;
    this.sid = sid;

    this.nickname = "";
    this.portrait = "";
};

module.exports = Player;

Player.prototype.loadBaseInfo = function(res){
    this.username = res.username;
};

