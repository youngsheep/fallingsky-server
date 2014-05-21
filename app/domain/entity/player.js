var Player = function(pid,uid,fid){
    this.uid = uid;
    this.pid = pid;
    this.fid = fid;

    this.nickname = "";
    this.portrait = "";
};

module.exports = Player;

Player.prototype.loadBaseInfo = function(res){
    this.uid = res.uid;
    this.nickname = res.nickname;
};

Player.prototype.loadOtherInfo = function(info){
    this.portrait = info.portrait;
};

