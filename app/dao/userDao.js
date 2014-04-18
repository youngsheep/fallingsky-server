var pomelo = require('pomelo');
var utils = require('../util/utils');

var userDao = module.exports;

userDao.createUser = function(username,passwd,cb){
    pomelo.app.get('dbclient').execute(function(client,release){
        client.hsetnx("users",username ,passwd,function(err,res){
            release();

            if (err) {       
                console.error("error response - " + err);
                utils.invokeCallback(cb, err);
                return;
            }
            if(res === 1){
                utils.invokeCallback(cb, null);
            }
            else{
                utils.invokeCallback(cb, "user exists!");
            }
        });
    });

};


userDao.getUserByName = function(name,cb){
    pomelo.app.get('dbclient').execute(function(client,release){
        client.hget("users",name ,function(err,res){
            release();
            utils.invokeCallback(cb, err, res);
        });
    });        
};
