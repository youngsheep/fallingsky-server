var utils = require('../../util/utils');

var bg_width = 14;
var bg_height = 20;           

var BLOCK_TYPE_VALUE = [
    [
         1, 1, 0, 0,
         1, 1, 0, 0,
         0, 0, 0, 0,
         0, 0, 0, 0
    ],
    [
         2, 0, 0, 0,
         2, 0, 0, 0,
         2, 2, 0, 0,
         0, 0, 0, 0
    ],
    [
         0, 3, 0, 0,
         0, 3, 0, 0,
         3, 3, 0, 0,
         0, 0, 0, 0
    ],   
    [
         0, 4, 0, 0,
         4, 4, 4, 0,
         0, 0, 0, 0,
         0, 0, 0, 0
    ],
    [
         5, 5, 0, 0,
         0, 5, 5, 0,
         0, 0, 0, 0,
         0, 0, 0, 0
    ],
    [
         0, 6, 6, 0,
         6, 6, 0, 0,
         0, 0, 0, 0,
         0, 0, 0, 0
    ],
    [
         0, 0, 0, 0,
         7, 7, 7, 7,
         0, 0, 0, 0,
         0, 0, 0, 0
    ]
];

var BattleMemeber = function(userid){
    this.userId = userid;
    this.blocks = new Array();
    for(var i = 0 ; i < bg_height ; i++){
        this.blocks[i] = new Array();
        for(var j = 0; j < bg_width; j++){
            this.blocks[i][j] = 0;
        }
    }
};

BattleMemeber.prototype.generateBlock = function(){
    this.curBlockType = utils.random() % 7;
    this.curBlock = BLOCK_TYPE_VALUE[this.curBlockType];
    console.log("curBlockType" + this.curBlockType);
};

BattleMemeber.prototype.fillBlock = function(x, y, flag){
    var block = this.rotateBlock(flag%4);

    for(var i = 0 ; i < 4 ; i++){
        for(var j  = 0 ; j < 4 ; j++){
            if(block[i*4+j] !== 0) {
                if((this.blocks[y-i][j+x]) === 0 ) {
                    this.blocks[y-i][j+x] = block[i*4+j];
                }
                else{
                    console.log("error!");
                    return false;
                }
            }
        }
    }

    var pstr = "\n";
    for(var yy = 0; yy < 20;yy++){
        for(var xx = 0;xx < 14; xx++){
            pstr = pstr+this.blocks[yy][xx];
        }
        pstr = pstr+"\n";
    }
    console.log(pstr);
    return true;
};

BattleMemeber.prototype.rotateBlock = function(flag){
    if(flag === 0){
        return this.curBlock;
    }

    var block = [   0,0,0,0,
                    0,0,0,0,
                    0,0,0,0,
                    0,0,0,0
                ];

    var i = 0 , j = 0;
    switch(this.curBlockType){
        case 0:{
            return this.curBlock;
        }
        case 1:
        case 2:
        case 3:
            for(i = 0 ; i < 3 ; i++){
                for(j  = 0 ; j < 3 ; j++){
                    switch(flag%4){
                        case 0:
                            block[i*4+j] = this.curBlock[i*4+j];
                            break;
                        case 1:
                            block[j*4+2-i] = this.curBlock[i*4+j];
                            break;
                        case 2:
                            block[(2-i)*4+2-j] = this.curBlock[i*4+j];
                            break;
                        case 3:
                            block[(2-j)*4+i] = this.curBlock[i*4+j];
                            break;
                        default:
                            break;
                    }
                }
            }
            break;
        case 4:
        case 5:
            for(i = 0 ; i < 3 ; i++){
                for(j  = 0 ; j < 3 ; j++){
                    switch(flag%2){
                        case 0:
                            block[i*4+j] = this.curBlock[i*4+j];
                            break;
                        case 1:
                            block[j*4+i] = this.curBlock[(2-i)*4+j];
                            break;
                        default:
                            break;
                    }
                }
            }
            break;
        case 6:
            for(i = 0 ; i < 4 ; i++){
                for(j  = 0 ; j < 4 ; j++){
                    switch(flag%2){
                        case 0:
                            block[i*4+j] = this.curBlock[i*4+j];
                            break;
                        case 1:
                            block[j*4+i] = this.curBlock[(3-i)*4+j];
                            break;
                        default:
                            break;
                    }
                }
            }            
            break;
        default:
            break;
    }

    return block;
};


module.exports = BattleMemeber;

