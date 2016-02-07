var InfoPanelBase = Class.create(BtnBase,{
	initialize : function($super,aCtx){
		$super(aCtx,0,0,GL_gazePoint.cnvsW,GL_gazePoint.cnvsH);
		this.ctx = aCtx;
		var mergin = 40;
		this.rect      = new uRect(mergin,mergin,GL_gazePoint.cnvsW-mergin*2,GL_gazePoint.cnvsH-mergin*2);
		var btnSize = 64;
		this.closeRect = new uRect(this.rect.rX-btnSize,this.rect.y,btnSize,btnSize);

		this.bgRGB = "rgb( 0, 0, 0)";
		this.lineRGB = "rgb( 220, 220, 220)";
		this.btnActive();
		
		this.strs = new Array();
	},
	btnEv : function (aX,aY){
		if( uInRect(aX,aY,this.closeRect) )
			{
			this.deActive();
			}
		return true;
	},
	deActive : function(){
		this.btnDeActive();
	},
	proc : function(){
	},
	draw : function(){
		var ctx=this.ctx;
		
		ctx.beginPath();

		ctx.globalAlpha = 0.9;
		
		//fg.
		ctx.fillStyle = this.bgRGB;
		uFillRect(this.ctx,this.rect);
		ctx.lineWidth = 4;
		ctx.strokeStyle = this.lineRGB;
		uStrokeRect(this.ctx,this.rect);
		//(X)
		ctx.fillStyle = this.lineRGB;
		var btnSize = 64;
		uFillRect(ctx,this.closeRect);
		
		
		ctx.globalAlpha = 1.0;
		
		ctx.font = "bold 20px 'ＭＳ ゴシック'";
		var posX = this.rect.x+10;
		var posY = this.rect.y+22;
		for( var i=0; this.strs.length > i ; i++ )
			{
			ctx.fillStyle = "black";
			ctx.strokeStyle = "gray";
			ctx.fillStyle = "white";
			ctx.strokeStyle = "white";
			ctx.fillText(this.strs[i], posX, posY);
			posY += 24;
			}

		
	}
});


/****
WarpPanel
****/
var WarpItems = {	
				"active"	:0,
				"deActive"	:1,
				"home"		:2,
				"products	":3,
				"weblogs"	:4,
				"weblinks"	:5
				};
var WarpPanel = Class.create({
	initialize : function(aCtx){
		this.ctx = aCtx;
		this.active = true;
		this.btnObsFunc = this.btnObs.bind(this);
		this.w = 180;
		this.h =  50;
		this.hM = 60+10;
		this.size = 5;/*項目数*/
		this.x = GL_gazePoint.cnvsW-(this.w*1.05);
		this.y = GL_gazePoint.cnvsH-(this.hM*this.size);
		var btnX = this.x;
		var btnY = this.y;
		var btnW = this.w;
		var btnH = this.h;
		//-----------------------
		//Panel(DeActive)
		//-----------------------
		this.activeBtn		= new ClbkImgBtn( this.ctx,btnX,btnY+this.hM*(this.size-1),btnW,btnH,this.btnObsFunc,WarpItems.active , "img/openWarp.png" );
		//-----------------------
		//Panel(Active)
		//-----------------------
		this.deActiveBtn	= new ClbkImgBtn( this.ctx,btnX,btnY,btnW,btnH,this.btnObsFunc,WarpItems.deActive , "img/closeWarp.png");
		this.btnArray = new Array();
		//home
		btnY += this.hM;
		var tmpBtn =new ClbkImgBtn( this.ctx,btnX,btnY,btnW,btnH,this.btnObsFunc,WarpItems.home,"img/warpHome.png" );
		this.btnArray.push( tmpBtn );
		//products
		btnY += this.hM;
		tmpBtn =new ClbkImgBtn( this.ctx,btnX,btnY,btnW,btnH,this.btnObsFunc,WarpItems.products,"img/warpProducts.png" );
		this.btnArray.push( tmpBtn );
		//weblogs
		btnY += this.hM;
		tmpBtn =new ClbkImgBtn( this.ctx,btnX,btnY,btnW,btnH,this.btnObsFunc,WarpItems.weblogs,"img/warpWeblogs.png" );
		this.btnArray.push( tmpBtn );
		//weblinks
		btnY += this.hM;
		tmpBtn =new ClbkImgBtn( this.ctx,btnX,btnY,btnW,btnH,this.btnObsFunc,WarpItems.weblinks,"img/warpLinks.png" );
		this.btnArray.push( tmpBtn );
		
		this.switchActive();
	},
	btnObs : function( aID ){
		switch( aID )
			{
		case WarpItems.active:
			this.switchActive();
			break;
		case WarpItems.deActive:
			this.switchDeActive();
			break;
		case WarpItems.home:
			this.doWarp(GL_starHome);
			break;
		case WarpItems.products:
			this.doWarp(GL_starProducts);
			break;
		case WarpItems.weblogs:
			this.doWarp(GL_starWeblogs);
			break;
		case WarpItems.weblinks:
			this.doWarp(GL_starWeblinks);
			break;
			}
	},
	switchActive : function(){
		this.activeBtn.btnDeActive();
		this.deActiveBtn.btnActive();
		for( var i=0; i< this.btnArray.size() ; i++ ){
			this.btnArray[i].btnActive();
			}
	},
	switchDeActive : function(){
		this.activeBtn.btnActive();
		this.deActiveBtn.btnDeActive();
		for( var i=0; i< this.btnArray.size() ; i++ ){
			this.btnArray[i].btnDeActive();
			}
	},
	doWarp : function(aStar){
		GL_player.warpLive(aStar);
	}
});


/****
Panel
****/
/*
var PanelItem = Class.create({
	initialize : function(aStr,aCallBack,aCallBackID){
		this.str = aStr;
		this.callBack = aCallBack;
		this.callBackID = aCallBackID;
		this.w = 18*8;
		this.h = 26;
	}
});
var Panel = Class.create(GameObj,{
	initialize : function($super,aCtx,aX,aY){
		$super();
		this.ctx = aCtx;
		this.x = aX;
		this.y = aY;
		this.active = false;
		this.items = new Array();
		this.clickObs = this.clickEv.bind(this);
		},
	pushItem : function( aPanelItem ){
		this.items.push(aPanelItem);
		},
	setActive : function( aActive ){
		var old = this.active;
		this.active = aActive;
		if( !old && aActive )
			{
			GL_evObj.pushObserv("click",this.clickObs);
			}
		else if( old && !aActive)
			{
			GL_evObj.popObserv("click",this.clickObs);
			}
		},
	clickEv : function( aX, aY ){
		if( !this.active ){return false;}
		var posX = this.x;
		var posY = this.y;
		var items = this.items;
		for( var i=0; i<this.items.length; i++)
			{
			if( (aX>=posX && aX<posX+items[i].w) && (aY>=posY && aY<posY+items[i].h) )
				{
				items[i].callBack(items[i].callBackID);
				return true;
				}
			posY += items[i].h;
			}
		return false;
		},
	draw : function( )
		{
		if( !this.active ){return;}
		var ctx = this.ctx;
		var items = this.items;
		ctx.font = "bold 18px 'ＭＳ ゴシック'";
		var posX = this.x;
		var posY = this.y;
		for( var i=0; i<this.items.length; i++)
			{
			this.ctx.globalAlpha = 0.7;
			ctx.fillStyle = "black";
			ctx.strokeStyle = "gray";
			ctx.fillRect(posX, posY,items[i].w, items[i].h);
			this.ctx.globalAlpha = 1.0;
			ctx.strokeRect(posX, posY,items[i].w, items[i].h);

			ctx.fillStyle = "white";
			ctx.strokeStyle = "white";
			ctx.fillText(items[i].str, posX+2, posY+18);
			posY += items[i].h;
			}
		
		}
});
*/
var StarLiveCtrl = Class.create({
	initialize : function(aCtx,aPlayer)
		{
		this.ctx = aCtx;
		this.player = aPlayer;
		var w = 120;var x = GL_gazePoint.cnvsW/2 -w/2;
		var h =  35;var y = GL_gazePoint.cnvsH -h -30;
//		this.tkofBtn = new ClbkBtn( this.ctx,x-w/1.5,y,w,h ,this.startTakeOff.bind(this) ,0, "rgb(100,100,100)" );
		this.lnchBtn = new ClbkImgBtn( this.ctx,x,y,w,h ,this.startLaunch.bind(this)  ,0, "img/launch.png");
		this.onFlg = false;
		},
	startTakeOff : function( aID )
		{
		this.player.state = PlayerState.tkoffInit;
		},
	startLaunch : function( aID )
		{
		this.player.state = PlayerState.launchInit;
		},
	mainPanelON : function()
		{
		if(!this.onFlg)
			{
			this.onFlg = true;
//			this.tkofBtn.btnActive();
			this.lnchBtn.btnActive();
			this.player.livingStar.onObjBtn();
			}
		},
	mainPanelOFF : function()
		{
		if(this.onFlg)
			{
			this.onFlg = false;
//			this.tkofBtn.btnDeActive();
			this.lnchBtn.btnDeActive();
			if( this.player.livingStar )
				{
				this.player.livingStar.offObjBtn();
				}
			}
		}
});
