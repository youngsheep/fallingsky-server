var request = require('request');
var qs = require('querystring');
var utils = require('../../../util/utils');

var appKey = "2475701841";
var appSecret = "382769d59920e4a93f6c82c3b2ec38c3";

module.exports = function(app) {
  return new Remote(app);
};

var Remote = function(app) {
  this.app = app;
};

Remote.prototype.auth = function(info,cb) {
    var info_url = "https://api.weibo.com/2/users/show.json?";
    var params = {
        access_token : info.token,
        uid:Number(info.uid)
    };
    request.get({url:info_url+qs.stringify(params)}, function (e, r, body) {
        var playerinfo = JSON.parse(body);
        utils.myPrint(playerinfo); 
        if(!!playerinfo.error){
            cb(playerinfo.error);
        }
        else{
            var data = {
                nickname: playerinfo.screen_name,
                portrait: playerinfo.profile_image_url
            };
            cb(null,data); 
        }
    });
};
