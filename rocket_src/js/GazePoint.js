/****
GazePoint
****/
var GazePoint = Class.create(GameObj,{
	initialize : function($super ,aCnvsW , aCnvsH ){
		$super();
		this.cx = 100;
		this.cy = 100;
		this.cnvsW = aCnvsW;
		this.cnvsH = aCnvsH;
		this.lxOfst = aCnvsW/2.0;
		this.lyOfst = aCnvsH/2.1;
		this.lx = this.cx - this.lxOfst;
		this.ly = this.cy - this.lyOfst;
	},
	posNtfy : function(){
		this.lx = this.cx - this.lxOfst;
		this.ly = this.cy - this.lyOfst;
	},
	draw : function(){
		$("posDisp").innerHTML
			= "cx:" + Math.floor(this.cx/10) +","+ Math.floor(this.cy/10);
	},
	getMod : function(aRate){
		return (this.cx+this.cy)%aRate;
	}
});

