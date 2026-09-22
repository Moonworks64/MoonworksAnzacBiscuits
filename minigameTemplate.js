var minigameBuildingName = 'Grandma'
if(Game.Objects[minigameBuildingName].minigame) throw new Error('Template prevented from loading by already present '+minigameBuildingName+' minigame.');

var M = {};
M.parent = Game.Objects[minigameBuildingName];
M.parent.minigame = M;
M.isModded = 1;

M.launch = function(){
	var M = this;
	
	M.init = function(div){
		// runs when loaded - not opened, loaded, like game load

		//populate div with html and initialize values

		M.dragonBoostTooltip=function()
		{
			return '<div style="width:280px;padding:8px;text-align:center;" id="tooltipDragonBoost"><b>Supreme Intellect</b><div class="line"></div>Yooooooo.</div>';
		}

		var str='';
		str+='<style>'+
		'#templateBG{background:url('+Game.resPath+'img/shadedBorders.png),url('+Game.mods['MoonworksAnzacBiscuits'].imagePrefix+'/BGvats.png);background-size:100% 100%,auto;position:absolute;left:0px;right:0px;top:0px;bottom:16px;}'+
		'#templateContent{position:relative;box-sizing:border-box;padding:4px;text-align:center;}'+
		'</style>';
		str+='<div id="templateBG"></div>';
		str+='<div id="templateContent">';

		str+='</div>';
		str+='</div>';
		div.innerHTML=str;
	}
	
	M.save = function(){
		// run when game saved - even if minigame not opened
		//output cannot use ",", ";" or "|"
		// Just a dummy function
		return '';
	};

	M.load = function(str){
		// run when game saved - even if minigame not opened
		//output cannot use ",", ";" or "|"
		// Just a dummy function
		if(!str) return false;
		
		M.saveString = str;
	};

	M.modSave = function(){
		// run when game saved - even if minigame not opened
		//output cannot use ",", ";" or "|"
		// In use: "!", "?", ":"

		var str=''

		console.log('Saving Template:');
		console.log(str);

		return str;
	}

	M.modLoad = function(str){
		//interpret str; called after .init
		//note : not actually called in the Game's load; see "minigameSave" in main.js
		if(!str) return false;
		console.log('Loading Template:');
		console.log(str);

		M.modSaveString = str;
	}
	
	M.reset = function(hard){
		// run when returning from an ascension, hard = 1 if full reset
	};
	
	M.logic = function(){
		//run each frame even if closed
	};
	
	M.onResize = function(){
		// run whenever the window is resized
	};
	
	M.draw = function(){
		//run each draw frame - when minigame is open
	};
	
	M.init(l('rowSpecial' + M.parent.id));
};

var M = 0;