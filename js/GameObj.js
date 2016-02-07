/****
GameObj
****/
var GameObj = Class.create({
	initialize : function(){
		this.activeObj();
		},
	deActiveObj : function(){
		GL_objs=GL_objs.without(this);
		},
	activeObj: function(){
		GL_objs.push(this);
		},
	proc : function(){
		},
	draw : function( ){
		}
});

/****
Circle
****/
var CircleObj = Class.create(GameObj,{
	initialize : function($super,aCtx,aX,aY){
		$super();
		this.ctx = aCtx;
		this.x = aX;
		this.y = aY;
		},
	proc : function(){
		this.x = this.x+1;
		},
	draw : function( ){
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, 20, 0, Math.PI*2, true);
		this.ctx.closePath();
		this.ctx.stroke();
		},
});



