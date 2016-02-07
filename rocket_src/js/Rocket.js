var PlayerState = {	
				"move"			:1,
				"lndInit"		:2,
				"lnding"		:3,
				"live"			:4,
				"tkoffInit"		:5,
				"tkoff"			:6,
				"launchInit"	:7,
				"launch"		:8
				};
var LaunchState = {	
				"idle"			:0,
				"init"			:1,
				"arrow"			:2,
				"tkoffInit"		:3,
				"tkoff"			:4
				};
var Rocket = Class.create(MapObj,{
	initialize : function($super,aCtx,aCx,aCy ){
		$super(aCtx,aCx,aCy);
		//速度.
		this.mX = 0;this.mY = 0;
		//加速値.
		this.pX = 0;this.pY = 0;
		//状態.
		this.state = PlayerState.move;
		//発射系.
		this.arrowTheta = 0;
		this.arrowLen = 100;
		this.stateLaunch = LaunchState.idle;
		var w = 120;var x = GL_gazePoint.cnvsW/2 -w/2;
		var h =  35;var y = GL_gazePoint.cnvsH -h -30;
		this.goBtn = new ClbkImgBtn( this.ctx,x-w/1.5,y,w,h ,this.launchGoBtnEv.bind(this) ,0,"img/goLaunch.png");
		this.cancelBtn = new ClbkImgBtn( this.ctx,x+w/1.5,y,w,h ,this.launchCancelBtnEv.bind(this)  ,0,"img/cancel.png");
		//tkoff系.
		this.zoom = 1;
		this.tkoffLndCntMax=40;
		this.tkoffLndCnt=0;
		//tail系.
		this.tailAnimCnt = 0;
		this.tailTheta = 0;
		//ライト系.
		this.lightCnt=0;
		this.lightPlusX=0;this.lightPlusY=0;
		//星系.
		this.starLiveCtrl = new StarLiveCtrl( aCtx ,this );
		this.livingStar = null;
		this.gravityX = 0;
		this.gravityY = 0;
		//イベント系.
		this.key = 0;
		GL_evObj.pushObserv("click",this.clickEv.bind(this));
		GL_evObj.pushObserv("mousemove",this.mousemoveEv.bind(this));
		Event.observe(window.document, "keydown", this.keyDown.bind(this), false);
		
		
		//warpLive
		this.warpLive(GL_starHome);
		
		},
	warpLive : function(aStar){
		this.starLiveCtrl.mainPanelOFF();
		this.goBtn.btnDeActive();
		this.cancelBtn.btnDeActive();
		this.livingStar = aStar;
		this.cx = aStar.cx;
		this.cy = aStar.cy;
		this.mX = 0;this.mY = 0;
		this.pX = 0;this.pY = 0;
		this.tkoffLndCnt = this.tkoffLndCntMax;
		this.state = PlayerState.live;
		/* gaze */
		GL_gazePoint.cx = this.cx;
		GL_gazePoint.cy = this.cy;
		GL_gazePoint.posNtfy();
		this.livingStar.renewDpos();
		},
	keyDown: function(aEvent){
		this.key = aEvent.keyCode;
		},
	clickEv : function(aX,aY){
		var x = aX - GL_gazePoint.lxOfst;
		var y = aY - GL_gazePoint.lyOfst;
		if( PlayerState.move  == this.state)
			{
			var radius = uGetRadius(x,y);
			if( this.tailAnimCnt <= 0 ){
				if( radius > 10 )
					{
					this.pX =  -x / radius;
					this.pY =  -y / radius;
					this.mX += this.pX*2.0;
					this.mY += this.pY*2.0;
					this.tailAnimCnt = 15;
					this.tailTheta = uGetTheta(this.pX,this.pY)
					return true;
					}
				}
			}
		else if( LaunchState.arrow  == this.stateLaunch )
			{
			var radius = uGetRadius(x,y);
			if(this.arrowLen > radius )
				{
				this.arrowTheta =uGetTheta(x/radius,y/radius);
				return true;
				}
			}
		return false;
	},
	proc : function(){
		switch( this.state )
			{
		case PlayerState.move:
			this.procMove();
			break;
		case PlayerState.lndInit:
			this.state = PlayerState.lnding;
			this.tkoffLndCnt = 0;
			break;
		case PlayerState.lnding:
			//todo:煙でもまきあげる？やるならエフェクトオブジェクトに任せる.
			this.procLnding();
			break;
		case PlayerState.live:
			this.starLiveCtrl.mainPanelON();
			break;
		case PlayerState.tkoffInit:
			this.starLiveCtrl.mainPanelOFF();
			this.state = PlayerState.tkoff;
			this.tkoffLndCnt = this.tkoffLndCntMax;
			break;
		case PlayerState.tkoff:
			this.procTkoff();
			break;
		case PlayerState.launchInit:
			this.starLiveCtrl.mainPanelOFF();
			this.state = PlayerState.launch;
			this.stateLaunch = LaunchState.init;
			this.procLaunch();
			break;
		case PlayerState.launch:
			this.procLaunch();
			break;
		case PlayerState.launchOut:
			this.state = PlayerState.move;
			break;
			}
		/* light */
		this.lightCnt++;
		if(this.lightCnt>30)
			{
			lightCnt=0;
			this.lightPlusX=Math.random();
			this.lightPlusY=Math.random();
			}
		
		/* gaze */
		GL_gazePoint.cx = this.cx;
		GL_gazePoint.cy = this.cy;
		GL_gazePoint.posNtfy();
	},
	mousemoveEv : function(aX,aY){
		return false;
		},
	procMove : function(){
		/* key */
		//if (this.key == Event.KEY_RETURN)	{this.mX =0;this.mY=0;}
		this.key = 0;
		
		/* grabity */
		this.mX += this.gravityX;
		this.mY += this.gravityY;
		$('debug').innerHTML = ""+Math.round(this.gravityX*1000)/1000+" , "+Math.round(this.gravityY*1000)/1000;
		
		/* move */
		this.cx += this.mX;
		this.cy += this.mY;
		},
	procLnding : function(){
		this.tkoffLndCnt++;
		if( this.tkoffLndCnt >= this.tkoffLndCntMax ){
			this.tkoffLndCnt = this.tkoffLndCntMax;
			this.state = PlayerState.live;
			}
		},
	procTkoff : function(){
		this.tkoffLndCnt--;
		if( this.tkoffLndCnt <= 0 ){
			this.tkoffLndCnt = 0;
			this.state = PlayerState.move;
			}
		},
	procLaunch : function(){
		//tkoffは飛び立つときやったほうがよさそう.
		switch(this.stateLaunch)
			{
		case LaunchState.init:
			this.arrowTheta = 0;
			this.stateLaunch = LaunchState.arrow;
			this.goBtn.btnActive();
			this.cancelBtn.btnActive();
			break;
		case LaunchState.arrow:
			break;
		case LaunchState.tkoffInit:
			this.tkoffLndCnt = this.tkoffLndCntMax;
			this.stateLaunch = LaunchState.tkoff;
			break;
		case LaunchState.tkoff:
			this.tkoffLndCnt -= 0.5+1*this.tkoffLndCnt/this.tkoffLndCntMax;
			this.procMove();
			if( this.tkoffLndCnt <= 0 ){
				this.tkoffLndCnt = 0;
				this.state = PlayerState.move;
				}
			break;
			}
		},
	launchGoBtnEv : function()
		{
		this.goBtn.btnDeActive();
		this.cancelBtn.btnDeActive();
		this.mX += Math.cos(this.arrowTheta)*10.0;
		this.mY += Math.sin(this.arrowTheta)*10.0;
		this.stateLaunch = LaunchState.tkoffInit;
		},
	launchCancelBtnEv : function()
		{
		this.goBtn.btnDeActive();
		this.cancelBtn.btnDeActive();
		this.state = PlayerState.live;
		},
	doDraw : function( ){
		this.zoom = 0.5 + 0.5*((this.tkoffLndCntMax - this.tkoffLndCnt)/this.tkoffLndCntMax);
		
		var circleL = 13*this.zoom;
		var circleS =  7*this.zoom;
		var ctx = this.ctx;
		
		/*arrow*/
		if( PlayerState.launch==this.state && LaunchState.arrow == this.stateLaunch )
			{
			ctx.strokeStyle = 'rgb(255, 20, 20)';
			ctx.fillStyle   = 'rgb(255, 20, 20)';
			
			ctx.globalAlpha = 0.3;
			ctx.beginPath();
			ctx.arc(this.dcx, this.dcy, this.arrowLen, 0, Math.PI*2, true);
				ctx.closePath();
			ctx.fill();
			ctx.globalAlpha = 0.5;
			ctx.stroke();
			ctx.globalAlpha = 1.0;
			
			ctx.beginPath();
			ctx.lineWidth = 1;
			
			ctx.moveTo(  this.dcx ,this.dcy );
			ctx.lineTo(  this.dcx+ Math.cos(this.arrowTheta)*this.arrowLen 
						,this.dcy+ Math.sin(this.arrowTheta)*this.arrowLen );
			ctx.stroke();
			}
		/*外円*/
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.fillStyle = 'rgb(120, 130, 240)';
		ctx.strokeStyle = 'rgb(20, 20, 30)';
		ctx.arc(this.dcx, this.dcy, circleL, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		/*しっぽ*/
		if( this.tailAnimCnt > 0 )
			{
			ctx.beginPath();
			ctx.strokeStyle = 'rgb(250, 250, 255)';
			var theta = this.tailTheta;
			ctx.moveTo( this.dcx -  Math.cos(theta)*circleL , this.dcy - Math.sin(theta)*circleL);
			ctx.lineTo( this.dcx -  Math.cos(theta)*circleL*2 , this.dcy - Math.sin(theta)*circleL*2);
			ctx.stroke();
			this.tailAnimCnt--;
			}
		
		/*十字線*/
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgb(90, 95, 210)';
		ctx.beginPath();
		ctx.moveTo( this.dcx - circleL+1 ,this.dcy - 00+1 );
		ctx.lineTo( this.dcx + circleL-1 ,this.dcy + 00-1 );
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo( this.dcx - 00+1 ,this.dcy - circleL+1 );
		ctx.lineTo( this.dcx + 00-1 ,this.dcy + circleL-1 );
		ctx.stroke();
		
		/*内円*/
		ctx.lineWidth = 1;
		ctx.fillStyle = 'rgb(200, 200, 240)';
		ctx.strokeStyle = 'rgb(20, 20, 30)';
		ctx.beginPath();
		ctx.arc(this.dcx, this.dcy, circleS, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		/*内円の光*/
		ctx.lineWidth = 1;
		ctx.fillStyle = 'rgb(240, 240, 255)';
		ctx.beginPath();
		ctx.arc(this.dcx+3*this.zoom+this.lightPlusX, this.dcy-3*this.zoom+this.lightPlusY, 2*this.zoom, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		
		},
	drawBody : function(){
		}
});

