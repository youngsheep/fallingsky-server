var Battle = required('./battle');

module.exports = function(){
    return new BattleMgr();
};

var BattleMgr = function(){
    this.battles = {};
    this.battleId = 1;
    console.log("Battle mgr constuct");
};


BattleMgr.prototype.getBattleByKey(key){
    return this.battles[key];
};

BattleMgr.prototype.createBattle(firstId,secondId){
    var key = firstId + "" + secondId + this.battleId;
    var battle = new Battle(key);
    battle.setBattleMember(firstId,secondId);
    ++ this.battleId;
    return battle;
};
