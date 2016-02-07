var BtnBase = Class.create(GameObj,{
	initialize : function($super,aCtx,aX,aY,aW,aH){
		$super();
		this.ctx = aCtx;
		this.x = aX;
		this.y = aY;
		this.w = aW;
		this.h = aH;
		//最初は非アクティブ.
		this.clickObs = this.clickEv.bind(this);
		this.isActive = true;
		this.btnDeActive();
		this.ownerMapObj = null;
		this.relativeX=0;
		this.relativeY=0;
		},
	setOwnerMapObj : function( aOwner )
		{
		this.ownerMapObj = aOwner;
		this.relativeX = this.x;
		this.relativeY = this.y;
		},
	clickEv : function(aX,aY){
		if(!( ( aX>=this.x && aX<=this.x+this.w   )&& 
			  (   aY>=this.y && aY<=this.y+this.h )   )){
			return false;
			}
		this.btnEv(aX,aY);
		return true;
		},
	btnEv : function() {
		//sample Btn
		alert("btn");
		},
	btnActive : function(){
		if(!this.isActive){
			if(this.ownerMapObj)
				{
				this.x = this.ownerMapObj.dcx+this.relativeX;
				this.y = this.ownerMapObj.dcy+this.relativeY;
				}
			GL_evObj.pushObserv("click",this.clickObs);
			this.isActive = true;
			this.activeObj();
			}
		},
	btnDeActive: function(){
		if(this.isActive){
			GL_evObj.popObserv("click",this.clickObs);
			this.isActive = false;
			this.deActiveObj();
			}
		},
	draw: function(){
		//sample draw.
		this.ctx.beginPath();
		this.ctx.fillStyle = "rgb( 220, 200, 80)";
		this.ctx.fillRect(this.x,this.y,this.w,this.h);
		}
});

var ClbkBtn = Class.create(BtnBase,{
	initialize : function($super ,aCtx ,aX,aY,aW,aH , aClbk , aClbkID ,aColor ){
		$super(aCtx , aX,aY,aW,aH);
		this.clbk   = aClbk;
		this.clbkID = aClbkID;
		if( aColor == undefined  ){aColor="rgb( 250, 250, 200)";}
		this.color = aColor;
		},
	btnEv : function(){
		this.clbk( this.clbkID );
		},
	draw: function(){
		//sample draw.
		this.ctx.beginPath();
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x,this.y,this.w,this.h);
		}
});

var ClbkImgBtn = Class.create(BtnBase,{
	initialize : function($super ,aCtx ,aX,aY,aW,aH , aClbk , aClbkID ,aImgPath ){
		$super(aCtx , aX,aY,aW,aH);
		this.clbk   = aClbk;
		this.clbkID = aClbkID;
		this.img = new Image();
		this.img.src = aImgPath;
		},
	btnEv : function(){
		this.clbk( this.clbkID );
		},
	draw: function(){
		//sample draw.
		this.ctx.beginPath();
		if( this.img.complete && this.img.width>0 )
			{
			this.ctx.drawImage( this.img , this.x , this.y );
			}
		else
			{
			this.ctx.fillStyle = "gray";
			this.ctx.fillRect(this.x,this.y,this.w,this.h);
			}
		}
});


var LandingBtn = Class.create(BtnBase,{
	initialize : function($super ,aCtx , aX,aY,aW,aH ){
		$super(aCtx , aX,aY,aW,aH);
		},
	btnEv : function(){
		GL_player.state = PlayerState.lndInit;
		GL_player.livingStar = this.landingTrg;
		},
	setTrgStar : function(aLandingTrg){
		this.landingTrg = aLandingTrg;
		if( null != aLandingTrg )
			{
			this.btnActive();
			}
		else
			{
			this.btnDeActive();
			}
		},
});


var RaderScale = {	
					"near"	:50,
					"far"	:150
					};
var Radar = Class.create(GameObj,{
	initialize : function($super ,aCtx ){
		$super();
		this.ctx = aCtx;
		this.cr = 70;
		this.crSq2 = this.cr*this.cr;
		this.cx = this.cr+2;
		this.cy = GL_gazePoint.cnvsH-this.cr-2;
		this.scale = RaderScale.near;
		GL_evObj.pushObserv("click",this.clickEv.bind(this));
	},
	clickEv : function(aX,aY){
		var powF = Math.pow;
		var distSq2 = powF(this.cx - aX,2)+powF(this.cy - aY,2);
		if( distSq2 <= this.crSq2 ){
			if(RaderScale.near==this.scale){
				this.scale = RaderScale.far;
			}else{
				this.scale = RaderScale.near;
				}
			return true;
			}
		return false;
		},
	draw : function(){
		var ctx = this.ctx;
		var cx  = this.cx;
		var cy  = this.cy;
		var cr  = this.cr;
		/*RaderCircle*/
		ctx.fillStyle = "rgb( 8, 28, 16)";
		ctx.strokeStyle = "rgb( 100, 200, 100)";
		ctx.globalAlpha = 0.7;
		ctx.lineWidth = 2;
		
		ctx.beginPath();
		ctx.arc(cx, cy, cr, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		ctx.globalAlpha = 1.0;
		ctx.lineWidth = 1;
		
		ctx.strokeStyle = "rgb( 60, 120, 70)";
		
		ctx.beginPath();
		ctx.moveTo(cx-cr,cy);
		ctx.lineTo(cx+cr,cy);
		ctx.moveTo(cx,cy-cr);
		ctx.lineTo(cx,cy+cr);
		ctx.stroke();
		
		if( this.scale == RaderScale.far ){
			ctx.beginPath();
			ctx.arc(cx, cy, cr/3.0, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(cx, cy, cr/1.5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.stroke();
			}
		else
			{
			ctx.beginPath();
			ctx.arc(cx, cy, cr/2.0, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.stroke();
			}
		
		var stars  = GL_stars;
		var player = GL_player;
		
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "rgb( 100, 200, 100)";
		ctx.moveTo(cx,cy);
		ctx.lineTo(cx+player.mX*5,cy+player.mY*5);
		ctx.closePath();
		ctx.stroke();
		ctx.lineWidth = 1;
		
		/*Stars*/
		ctx.beginPath();
		ctx.fillStyle = "rgb( 80, 240, 80)";
		var scale = this.scale;
		var pixSz = 2;
		var powF = Math.pow;
		if( this.scale == RaderScale.far ){
			pixSz = 1;
			}
		var area = powF(cr-2,2);
		var scaleSq2 = powF(scale,2);
		for(var i = 0; i < stars.length; i ++){
			//距離の２乗で計算.
			if( stars[i].distSq2/scaleSq2 < area ){
				var scx = (stars[i].cx-player.cx )/ scale;
				var scy = (stars[i].cy-player.cy )/ scale;
				ctx.arc(cx+scx, cy+scy, pixSz, 0, Math.PI*2, false)
				//ctx.fillRect( cx-pixSz+scx, cy-pixSz+scy, pixSz*2,pixSz*2 );
				ctx.fill();
				}
			}
		ctx.closePath();
	}
});
