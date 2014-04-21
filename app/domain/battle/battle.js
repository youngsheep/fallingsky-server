
module.exports = function(id){
    return new Battle(id);
};
var Battle = function(id){
    this.battleKey = Key;
    this.members = [];
    this.mNum = 0;
};

Battle.prototype.init = function(m1,m2){
    this.mNum = this.members.push(m1);
    this.mNum = this.members.push(m2);
};
