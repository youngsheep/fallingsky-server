var Member = require('../domain/entity/battleMember');

var BattleMgr = function(){
    this.battles = {};
    this.battleId = 1;
    console.log("Battle mgr constuct");
};


module.exports = BattleMgr; 

BattleMgr.prototype.getBattleById = function(id){
    return this.battles[id];
};

BattleMgr.prototype.createBattle = function(firstId,secondId){
    var battle = new Battle(this.battleId);
    battle.addMember(firstId,secondId);
    battle.addMember(secondId,firstId);
    
    this.battles[this.battleId] = battle;
    ++this.battleId;
    return battle;
};

var Battle = function(id){
    this.id = id;
    this.members = {};
};

Battle.prototype.addMember = function(mid,oppid){
    var member = new Member(mid);
    member.oppid = oppid;

    this.members[mid] = member;
};

Battle.prototype.getMemberByUid = function(uid){
    return this.members[uid];
};

