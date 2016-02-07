var GL_evObj = null;
var GL_ImgCtrl=null;
var GL_gazePoint = null;
var GL_stars =new Array();
var GL_objs  =new Array();
var GL_player=null;
var GL_debugI=0;
var GL_starLiveCtrl = null;
var GL_starHome = null;
var GL_starProducts = null;
var GL_starWeblogs = null;
var GL_starWeblinks = null;
/****
MainLoop
****/
var MainLoop = Class.create({
	initialize : function(){
		this.fps = 40;
		this.frameInterval = 1000/this.fps;
		this.prvTime = new Date();
		this.frameCnt = 0;
		},
	procStart : function(){
		this.proc();
		},
	proc : function(){
		
		//renew.
		this.frameCnt++;
		if( this.frameCnt%10 == 0 ){
			$("fpsDisp").
			innerHTML = "fps:" + Math.round(1000/(new Date() -this.prvTime));
		}
		if( this.frameCnt > this.fps){
			this.frameCnt = 0;
		}
		this.prvTime = new Date();

		
		//proc.
		var objs = GL_objs;
		var cnt = GL_objs.length;
		for( var i=0; i<cnt; i++){
			GL_debugI =i;
			objs[i].proc();
			}
		
		//draw.
		for( var i=0; i<cnt; i++){
			GL_debugI =i;
			objs[i].draw();
			}

		
		//fps control.
		var currTime = new Date();
		var waitTime = this.frameInterval - (currTime - this.prvTime);
		if( 0 > waitTime)
			{
			waitTime = 0;
			}
		setTimeout(this.proc.bind(this),waitTime);
		}
});

window.onload = function ()
	{
	var canvas = $('mainCanvas');
	var ctx = canvas.getContext('2d');
	GL_evObj     = new EventObj();
	GL_gazePoint = new GazePoint(canvas.width , canvas.height);
	var gaze = GL_gazePoint;
	
	new BgFill(ctx);
	new BgScroll_1(ctx);
	
	new StarCtrl( ctx , GL_stars );


	GL_starHome = new MapCircle(ctx, 100,120);
	GL_starProducts = new MapCircle(ctx, 1000,1200);
	GL_starWeblogs = 	new MapWeblogs(ctx, 1000,-1200);
	GL_starWeblinks = 	new MapCircle(ctx, 20000,12000);


	GL_player = new Rocket(ctx,100,100);
	new Radar(ctx);

	new WarpPanel(ctx);

	var main = new MainLoop();
	
	main.procStart();
	};



