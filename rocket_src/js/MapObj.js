/****
MapObj
****/
var MapObj = Class.create(GameObj,{
	initialize : function($super,aCtx,aCx,aCy){
		$super();
		this.ctx = aCtx;
		this.cx = aCx;
		this.cy = aCy;
		this.dcx = this.cx - GL_gazePoint.lx;
		this.dcy = this.cy - GL_gazePoint.ly;
		},
	renewDpos : function()
		{
		this.dcx = this.cx - GL_gazePoint.lx;
		this.dcy = this.cy - GL_gazePoint.ly;
		},
	draw : function( ){
		this.dcx = this.cx - GL_gazePoint.lx;
		this.dcy = this.cy - GL_gazePoint.ly;
		this.doDraw();
		}
});
var LandingPoint = Class.create({
	initialize : function( aCx , aCy , aR ){
		this.cx = aCx;
		this.cy = aCy;
		this.r = aR;
		}
});
var StarDistPri = {	
					"noeffect"	:1,
					"gravity"	:2,
					"draw"		:3,
					"lide"		:4
					};
var StarCtrl = Class.create(GameObj,{
	initialize : function($super,aCtx,aStars){
		$super();
		
		this.stars = aStars;
		
		var w = 180;var x = GL_gazePoint.cnvsW/2 -w/2;
		var h =  55;var y = GL_gazePoint.cnvsH-h-20;
		this.lndBtn = new LandingBtn(aCtx,x,y,w,h);
		},
	proc : function(){
		//距離情報の更新
		var player = GL_player;
		var absF = Math.abs;
		var minF = Math.min;
		var powF = Math.pow;
		var drawDistSq2    = powF(GL_gazePoint.cnvsW * GL_gazePoint.cnvsH,2);
		var gravityDistSq2 = powF(GL_gazePoint.cnvsW * GL_gazePoint.cnvsH*20,2)
		this.lndBtn.setTrgStar(null);
		var lndSearch = false;
		var enableLnd = false;
		if( player.state == PlayerState.move && ((player.mX*player.mX + player.mY*player.mY)<3*3) ){
			lndSearch = true;
			}
		
		player.gravityX = 0;
		player.gravityY = 0;
		var fixGravity = false;
		for( var i = 0 ; i<this.stars.length ; i++ ){
			//距離情報更新.
			var star = this.stars[i];
			var xDif = minF(absF(star.cx - player.cx) ,1000000);
			var yDif = minF(absF(star.cy - player.cy) ,1000000);
			star.distSq2 = xDif*xDif + yDif*yDif;
			if		( star.distSq2 < powF(star.starR,2)	){star.distPri = StarDistPri.lide;}
			else if	( star.distSq2 < drawDistSq2		){star.distPri = StarDistPri.draw;}
			else if	( star.distSq2 < gravityDistSq2		){star.distPri = StarDistPri.gravity;}
			else										 {star.distPri = StarDistPri.noeffect;}
			//grabity
			if( !fixGravity && star.distPri >= StarDistPri.gravity ){
				if( star.distPri == StarDistPri.lide )
					{
					//星の中に入ってたら、引力なし.
					player.gravityX = 0;
					player.gravityY = 0;
					fixGravity = true;//重力固定.
					//抵抗
					player.mX /= 1.03;
					player.mY /= 1.03;
					if( absF(player.mX) < 0.1 ){player.mX=0;}
					if( absF(player.mY) < 0.1 ){player.mY=0;}
					}
				else{
					var force = star.mass/star.distSq2;
					force = minF(force , 8.0);
					player.gravityX += force/(xDif+yDif)*(star.cx - player.cx);
					player.gravityY += force/(xDif+yDif)*(star.cy - player.cy);
					}
				}
			
			//LandingSearch
			if( lndSearch && (star.distPri>=StarDistPri.lide) ){
				for( var j=0; j< star.landingPoints.length ; j++ )
					{
					var x = absF(star.landingPoints[j].cx+star.cx - player.cx);
					var y = absF(star.landingPoints[j].cy+star.cy - player.cy);
					if( x*x+y*y < star.landingPoints[j].r*star.landingPoints[j].r ){
						enableLnd = true;
						lndSearch = false;
						this.lndBtn.setTrgStar(star);
						break;
						}
					}
				}
			}
		
		
		}
});
var StarBase = Class.create(MapObj,{
	initialize : function($super,aCtx,aCx,aCy,aStarR,aMass){
		$super(aCtx,aCx,aCy);
		GL_stars.push(this);
		this.starR=aStarR;
		this.landingPoints=new Array();
		this.distPri = StarDistPri.far;
		this.distSq2 = 0; /*距離の２乗*/
		this.mass = aMass;
		this.orgObjArray = null;
		
		},
	onObjBtn : function()
		{
		delete this.orgObjArray;
		this.orgObjArray = new Array();
		this.mkObjBtn();
		for( var i=0;this.orgObjArray.length > i;i++)
			{
			this.orgObjArray[i].setOwnerMapObj(this);
			this.orgObjArray[i].btnActive();
			}
		},
	offObjBtn : function()
		{
		for( var i=0;this.orgObjArray.length > i;i++)
			{
			this.orgObjArray[i].btnDeActive();
			}
		delete this.orgObjArray;
		this.orgObjArray = null;
		},
	mkObjBtn : function()
		{
		//子クラスで実装.
		},
	doDraw : function(){
		if( this.distPri >= StarDistPri.draw )
			{
			this.ctx.globalAlpha = 1.0;
			this.drawStar();
			if( GL_player.state == PlayerState.move && this.distPri >=StarDistPri.lide )
				{
				this.drawLndP();
				}
			}
		},
	drawStar : function(){
		},
	drawLndP : function(){
		this.ctx.globalAlpha = 0.3;
		for(var i = 0; i < this.landingPoints.length; i ++){
			var ldp = this.landingPoints[i];
			this.ctx.beginPath();
			this.ctx.fillStyle   = "rgb(220,90,90)";
			this.ctx.arc(this.dcx +ldp.cx, this.dcy+ldp.cy, +ldp.r+4, 0, Math.PI*2, true);
			this.ctx.closePath();
			this.ctx.fill();
			this.ctx.beginPath();
			this.ctx.fillStyle   = "rgb(240,100,100)";
			this.ctx.arc(this.dcx +ldp.cx, this.dcy+ldp.cy, +ldp.r-2, 0, Math.PI*2, true);
			this.ctx.closePath();
			this.ctx.fill();
			}
		}
});

var MapCircle = Class.create(StarBase,{
	initialize : function($super,aCtx,aCx,aCy){
		this.img = new Image();
		this.img.src = "img/star001.png";
		
		$super(aCtx,aCx,aCy,150,3000);
		
		this.landingPoints.push( new LandingPoint(20,20,40) );
		},
	btnFunc : function(aID){
		var panel = new InfoPanelBase(this.ctx);
		panel.strs.push("テスト");
		panel.strs.push("テスト2");
		},
	mkObjBtn : function() {
		this.orgObjArray.push( new ClbkImgBtn( this.ctx,-64,-80,48,48,this.btnFunc,0,"img/objHome.png") );
		this.orgObjArray.push( new ClbkImgBtn( this.ctx,  0,-40,36,36,this.btnFunc,0,"img/objNews1.png") );
		},
	drawStar : function( ){
		this.ctx.fillStyle   = "rgb(150,150,150)";
		this.ctx.strokeStyle = "rgb(150,150,150)";
		if( this.img.complete && this.img.width>0 )
			{
			this.ctx.drawImage( this.img , this.dcx-this.starR , this.dcy-this.starR );
			}
		else
			{
			this.ctx.lineWidth = 3;
			this.ctx.beginPath();
			this.ctx.arc(this.dcx, this.dcy, this.starR, 0, Math.PI*2, true);
			this.ctx.closePath();
			this.ctx.fill();
			this.ctx.stroke();
			}
		}
});

var MapWeblogs = Class.create(StarBase,{
	initialize : function($super,aCtx,aCx,aCy){
		this.img = new Image();
		this.img.src = "img/desertstar3.png";
		
		$super(aCtx,aCx,aCy,160,3000);
		
		this.landingPoints.push( new LandingPoint(20,20,40) );
		},
	btnFunc : function(aID){
		var panel = new InfoPanelBase(this.ctx);
		panel.strs.push("テスト");
		panel.strs.push("テスト2");
		},
	mkObjBtn : function() {
		this.orgObjArray.push( new ClbkImgBtn( this.ctx,-90,  0,48,48,this.btnFunc,0,"img/objTwitter.png") );
		this.orgObjArray.push( new ClbkImgBtn( this.ctx,-20,-40,40,20,this.btnFunc,0,"img/objHatena4.png") );
		this.orgObjArray.push( new ClbkImgBtn( this.ctx, 20, 40,58,45,this.btnFunc,0,"img/objBlog2.png") );
		this.orgObjArray.push( new ClbkImgBtn( this.ctx, 40,-80,27,32,this.btnFunc,0,"img/objPhoto3.png") );
		},
	drawStar : function( ){
		this.ctx.fillStyle   = "rgb(150,150,150)";
		this.ctx.strokeStyle = "rgb(150,150,150)";
		if( this.img.complete && this.img.width>0 )
			{
			this.ctx.drawImage( this.img , this.dcx-this.starR , this.dcy-this.starR );
			}
		else
			{
			this.ctx.lineWidth = 3;
			this.ctx.beginPath();
			this.ctx.arc(this.dcx, this.dcy, this.starR, 0, Math.PI*2, true);
			this.ctx.closePath();
			this.ctx.fill();
			this.ctx.stroke();
			}
		}
});

