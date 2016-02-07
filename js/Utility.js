function uGetRadius(aX,aY)
	{
	return Math.sqrt(aX*aX+aY*aY);
	}
function uGetTheta(aX,aY)
	{
	var a_c = Math.acos( aX );
	var theta = a_c;
	if( Math.asin( aY ) < 0.0 )
		{
		theta = Math.PI*2 - a_c;
		}
	return theta;
	}
function uDebug(aStr)
	{
	$('debug').innerHTML = aStr;
	}
function uFillRect(aCtx , aRect){
	aCtx.fillRect(aRect.x,aRect.y,aRect.w,aRect.h);
	}
function uStrokeRect(aCtx , aRect){
	aCtx.strokeRect(aRect.x,aRect.y,aRect.w,aRect.h);
	}
function uInRect( aX,aY,aRect ){
	if( aX>=aRect.x && aX<=aRect.rX && aY>=aRect.y && aY<=aRect.rY )
		{
		return true;
		}
	return false;
	}
var uRect = Class.create({
	initialize : function(aX,aY,aW,aH){
		this.x = aX;
		this.y = aY;
		this.w = aW;
		this.h = aH;
		this.rX= aX+aW;
		this.rY= aY+aH;
	}
});

