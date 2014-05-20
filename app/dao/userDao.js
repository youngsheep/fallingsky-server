var pomelo = require('pomelo');
var utils = require('../util/utils');

var userDao = module.exports;

userDao.createPlayer = function(username,info,cb){
    pomelo.app.get('dbclient').execute(function(client,release){
        client.hmset("base-info-"+username, info ,function(err,res){
            release();

            utils.myPrint(info,"   create res : ",res);
            utils.invokeCallback(cb, err);
        });
    });

};


userDao.getPlayerBaseInfo = function(name,field,cb){
    pomelo.app.get('dbclient').execute(function(client,release){
        client.hget("base-info-"+name,field,function(err,res){
            release();

            utils.myPrint("getPlayerBaseInfo : ",res);
            utils.invokeCallback(cb, err, res);
        });
    });        
};

userDao.getPlayerAllBaseInfo = function(name,cb){
    pomelo.app.get('dbclient').execute(function(client,release){
        client.hgetall("base-info-"+name,function(err,res){
            release();

            utils.myPrint("name:",name, " error :",err , "   getPlayerAllBaseInfo : " , res);
            utils.invokeCallback(cb, err, res);
        });
    });
};
