/****
EventObj
****/
var EventObj = Class.create({
	initialize : function(){
		
		var tmpArray = ["mousemove","click"];
		this.eventObsrvs = {};
		for( var i=0; i<tmpArray.length; i++){
			var evName = tmpArray[i];
			this.eventObsrvs[evName] = new Array();
			$('mainCanvas').observe(evName,	this.eventObs.bind(this,evName));
			}
		},
	pushObserv : function( aEvName, aObs ){
		var obs = this.eventObsrvs[aEvName];
		obs[obs.length] = aObs;
		},
	popObserv : function( aEvName, aObs ){
		this.eventObsrvs[aEvName] = this.eventObsrvs[aEvName].without( aObs );
		},
	eventObs : function(aEvName,aEvent){
		var obsrvs = this.eventObsrvs[aEvName];
		var cnt = obsrvs.length;
		if(cnt<1){return;}
		var x = aEvent.clientX;
		var y = aEvent.clientY;
		var rect = aEvent.target.getBoundingClientRect();
		x -= rect.left;
		y -= rect.top;
		//後から登録されたやつが優先.
		for( var i=0; i<cnt; i++){
			if( obsrvs[cnt-i-1](x,y) ){
				break;
				}
			}
		}
});


