var RandomMatchService = function() {
    this.first = -1;
};

module.exports = function(){
    return new RandomMatchService();
}

RandomMatchService.prototype.add = function(uid,cb){
    if(this.first !== -1)
    {
        cb(this.first);
        this.first = -1;
    }
    else
    {
        cb(-1);
        this.first = uid;
    }
}
