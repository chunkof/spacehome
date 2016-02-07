/****
BgFill
****/
var BgFill = Class.create(GameObj,{
	initialize : function($super,aCtx){
		$super()
		this.ctx = aCtx;
		},
	draw : function( ){;
		this.ctx.globalAlpha = 1.0;
		this.ctx.fillStyle = "rgb(8, 12, 8)";
		this.ctx.fillRect(0, 0, GL_gazePoint.cnvsW , GL_gazePoint.cnvsH);
		},
});

var BgScroll = Class.create(GameObj,{
	initialize : function($super,aCtx){
		$super();
		this.ctx = aCtx;
		this.dcx = 0;
		this.dcy = 0;
		this.pX = 0;
		this.pY = 0;
		this.pR = 0;
		this.cnt = 0;
		this.cnt2 = 0;
		},
	draw : function(){

		this.cnt++;if(this.cnt>10000){this.cnt=0;}
		this.pR = 0.000;
		this.pX = 000;this.pY = 000;
		this.doDraw();

		this.pR = 0.011;
		this.pX = 200;this.pY = 500;
		this.doDraw();

		this.pR = 0.002;
		this.pX = 350;this.pY = 270;
		this.doDraw();

		this.pR = 0.003;
		this.pX = 150;this.pY = 400;
		this.doDraw();

		this.pR = 0.014;
		this.pX = 050;this.pY = 000;
		this.doDraw();

		this.pR = 0.005;
		this.pX = 000;this.pY = 700;
		this.doDraw();

		},
	drawDst : function( aX , aY ,aRate,aSize ){
		aX += this.pX;
		aY += this.pY;
		aRate=(aRate+this.pR)/2;
		this.cnt2++;if(this.cnt2>10000){this.cnt2=0;}
		var tmp = (this.cnt+this.cnt2*5+aX+aY) % 400;
		if( aSize<2 && tmp>390 )
			{
			return;
			}
		else if (tmp>398)
			{
			return;
			}
		this.dcx = -((GL_gazePoint.lx*aRate) % this.w );
		this.dcy = -((GL_gazePoint.ly*aRate) % this.h );
		var x = this.dcx+aX;
		var y = this.dcy+aY;
		this.ctx.beginPath();
		if     ( x-32 > GL_gazePoint.cnvsW	){x = x-this.w;}
		else if( x+32 < 0					){x = x+this.w;}
		if     ( y-32 > GL_gazePoint.cnvsH	){y = y-this.h;}
		else if( y+32 < 0					){y = y+this.h;}
		//todo:ズレまくってたらここで移動させる（これで星屑のワンパターン化防ぐ).
		this.doDrawDst( x , y ,aSize);
		},
});

//todo:後ろの方が小さくて暗くて、いっぱいある！
//todo:点滅によるきらめきの表現
var BgScroll_1 = Class.create(BgScroll,{
	initialize : function($super,aCtx){
		$super(aCtx);
		//todo:もっと広くする2倍ぐらい
		//todo:近めの星がパターンかぶってるように見えるんで、なんとかする。
		this.w = 800;
		this.h = 600;
		},
	doDraw : function( ){
		var gazeMod = GL_gazePoint.getMod;
		
		this.ctx.fillStyle = 'rgb(240, 240, 240)';

		this.drawDst( 58,  30,0.410,2);
		this.drawDst(604, 100,0.420,2);

		this.ctx.fillStyle = 'rgb(200, 250, 200)';
		this.drawDst(261, 213,0.210,1);
		this.drawDst(524, 112,0.302,1);

		this.ctx.fillStyle = 'rgb(100, 100, 50)';
		this.drawDst(693,  42,0.453,2);
		this.drawDst(716, 260,0.415,2);

		this.ctx.fillStyle = 'rgb(150, 100, 100)';
		this.drawDst( 40, 360,0.417,2);
		this.drawDst(788, 454,0.497,2);
	
		this.ctx.fillStyle = 'rgb(140, 140, 140)';
		this.drawDst( 58,  30,0.210,1);
		this.drawDst( 38, 420,0.320,1);
		this.drawDst(604, 100,0.280,1);

		this.ctx.fillStyle = 'rgb(145, 145, 145)';
		this.drawDst(356, 470,0.400,1);
		this.drawDst(007, 249,0.322,1);
		this.drawDst(464,  48,0.470,2);
		this.drawDst(142, 322,0.300,1);

		this.ctx.fillStyle = 'rgb(200, 250, 200)';
		this.drawDst(543, 570,0.260,1);
		this.drawDst(524, 112,0.300,1);

		this.ctx.fillStyle = 'rgb(200, 200, 50)';
		this.drawDst(693,  42,0.287,1);

		this.ctx.fillStyle = 'rgb(250, 200, 200)';
		this.drawDst(130, 578,0.300);
		this.drawDst(788, 454,0.255);

		this.ctx.fillStyle = 'rgb(240, 240, 140)';
		this.drawDst( 58,  30,0.210,1);
		this.drawDst(604, 100,0.201,1);

		this.ctx.fillStyle = 'rgb(145, 165, 145)';
		this.drawDst(164, 132,0.208,1);
		this.drawDst(142, 322,0.220,2);
		this.drawDst(214,  62,0.190,1);

		this.ctx.fillStyle = 'rgb(200, 250, 200)';
		this.drawDst(261, 213,0.170,1);
		this.drawDst(524, 112,0.208);

		this.ctx.fillStyle = 'rgb(200, 200, 50)';
		this.drawDst(693,  42,0.231);
		this.drawDst(328, 180,0.222,1);

		this.ctx.fillStyle = 'rgb(250, 200, 200)';
		this.drawDst(493, 192,0.218);
		this.drawDst(788, 454,0.235);

		this.ctx.fillStyle = 'rgb(240, 240, 240)';
		this.drawDst( 58,  30,0.110,1);
		this.drawDst(604, 100,0.105,1);

		this.ctx.fillStyle = 'rgb(105, 115, 105)';
		this.drawDst(163, 132,0.120,1);
		this.drawDst(356, 420,0.102,1);
		this.drawDst(314,  62,0.109,1);
		this.drawDst(262, 732,0.120,1);
		this.drawDst(355, 170,0.110,1);
		this.drawDst(094, 155,0.089,1);
		this.drawDst(274, 172,0.180,1);
		this.drawDst(755, 170,0.122,1);
		this.drawDst(454, 715,0.089,1);

		this.ctx.fillStyle = 'rgb(100, 150, 100)';
		this.drawDst(261, 213,0.101,1);
		this.drawDst(524, 112,0.100,1);

		this.ctx.fillStyle = 'rgb(100, 100, 50)';
		this.drawDst(693,  42,0.090,1);
		this.drawDst(328, 180,0.111,1);

		this.ctx.fillStyle = 'rgb(150, 100, 100)';
		this.drawDst(493, 192,0.100,1);
		this.drawDst(788, 454,0.107,1);

		this.ctx.fillStyle = 'rgb(105, 105, 105)';
		this.drawDst(316, 213,0.050,1);
		this.drawDst(635, 042,0.052,1);
		this.drawDst(031, 206,0.059,1);
		this.drawDst(226, 273,0.050,1);
		this.drawDst(035, 017,0.050,1);
		this.ctx.fillStyle = 'rgb(115, 105, 105)';
		this.drawDst(429, 115,0.059,1);
		this.drawDst(127, 217,0.050,1);
		this.drawDst(575, 017,0.052,1);
		this.drawDst(435, 571,0.059,1);

		this.ctx.fillStyle = 'rgb(85, 85, 85)';
		this.drawDst(136, 123,0.050,1);
		this.drawDst(365, 402,0.052,1);
		this.drawDst(301, 026,0.059,1);
		this.drawDst(226, 723,0.050,1);
		this.drawDst(305, 107,0.050,1);
		this.ctx.fillStyle = 'rgb(95, 75, 75)';
		this.drawDst(249, 115,0.059,1);
		this.drawDst(217, 127,0.050,1);
		this.drawDst(755, 107,0.052,1);
		this.drawDst(345, 751,0.059,1);
		this.ctx.fillStyle = 'rgb(85, 85, 95)';
		this.drawDst(166, 423,0.040,1);
		this.drawDst(275, 202,0.052,1);
		this.drawDst(381, 326,0.056,1);
		this.drawDst(496, 423,0.057,1);
		this.drawDst(505, 207,0.051,1);
		this.drawDst(049, 115,0.052,1);
		this.drawDst(117, 217,0.052,1);
		this.drawDst(855, 017,0.055,1);
		this.drawDst(945, 151,0.059,1);

		this.ctx.fillStyle = 'rgb(135, 145, 135)';
		this.drawDst(164, 132,0.130,1);
		this.drawDst(307, 249,0.185,1);
		this.drawDst(214,  62,0.121,1);
		},
	doDrawDst : function( aX, aY , aSize ){
		this.ctx.fillRect(aX,aY,aSize,aSize);
		this.ctx.fill();
		},
});
