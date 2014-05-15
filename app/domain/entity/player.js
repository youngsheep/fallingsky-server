var Player = function(uid,username,fid){
    this.username = username;
    this.uid = uid;
    this.fid = fid;

    this.nickname = "";
    this.portrait = "";
};

module.exports = Player;

Player.prototype.loadBaseInfo = function(res){
    this.username = res.username;
    this.nickname = res.nickname;
    this.portrait = res.portrait;
};

