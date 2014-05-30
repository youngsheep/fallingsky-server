var request = require('request');
var qs = require('querystring');
var utils = require('../../../util/utils');

var appKey = "2698066879";
var appSecret = "8adc1284f572439c5577fc38b15cc2d4";

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
