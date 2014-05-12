var pomelo = require('pomelo');
var utils = require('../util/utils');

var userDao = module.exports;

userDao.createPlayer = function(username,info,cb){
    pomelo.app.get('dbclient').execute(function(client,release){
        client.hmset("BaseInfo"+username, info ,function(err,res){
            release();

            console.log("create res : "+res);
            utils.invokeCallback(cb, err);
        });
    });

};


userDao.getPlayerBaseInfo = function(name,field,cb){
    pomelo.app.get('dbclient').execute(function(client,release){
        client.hget("BaseInfo"+name,field,function(err,res){
            release();

            console.log("getPlayerBaseInfo : ");
            console.log(res);
            utils.invokeCallback(cb, err, res);
        });
    });        
};

userDao.getPlayerAllBaseInfo = function(name,cb){
    pomelo.app.get('dbclient').execute(function(client,release){
        client.hgetall("BaseInfo"+name,function(err,res){
            release();

            console.log("getPlayerAllBaseInfo : ");
            console.log(res);
            utils.invokeCallback(cb, err, res);
        });
    });
};
