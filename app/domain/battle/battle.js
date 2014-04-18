
module.exports = function(id){
    return new Battle(id);
};
var Battle = function(id){
    this.battleid = id;
};

Battle.prototype.setBattleMember = function(m1,m2){
    this.m1 = m1;
    this.m2 = m2;
};
