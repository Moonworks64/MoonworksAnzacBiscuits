// MOONWORKS EXTRA MINIGAMES MOD BEGIN
var MEMver = "You beta";
var isLocal = window.location.protocol=='http:';
var MEMdebug = isLocal;

var MMMImagePrefix = isLocal?'MoreMinigames/img':'https://moonworks64.github.io/MoreCookieMinigames/img';

Game.registerMod('MoonworksMoreMinigames',{
    init:function(){
        // Load minigames
        var you = Game.Objects['You'];
        you.minigameUrl = isLocal?'MoreMinigames/minigameVats.js':'https://moonworks64.github.io/MoreCookieMinigames/minigameVats.js';
        you.minigameName = 'Incubator Vats';

        Game.LoadMinigames();

        if (MEMdebug) {
            //Game.HardReset(-1)
            Game.OpenSesame();
            Game.Earn(50000000000000000000000000000000000000000);
            Game.prefs.notifs=1;
            for (var i in Game.Objects) {
                var me=Game.Objects[i];
                me.buy(100);
                if (!(me.id == 19)) {
                    me.muted = 1;
                }
                if (me.level<1)
                {
                    me.levelUp(true);
                }
            }		
        };

       // New buffs
       new Game.buffType('glorious rays',function(time,pow)
        {
            return {
                name:'Glorious Rays',
                desc:'Cookie production +'+Math.floor(pow*100-100)+'% for '+Game.sayTime(time*Game.fps,-1)+'!',
				icon:[14,30],
				time:time*Game.fps,
				max:true,
				multCpS:pow,
				aura:1
            };
        });
        new Game.buffType('time dilation',function(time,pow)
        {
            return {
                name:'Time Dilation',
				desc:'Cookie production x'+pow+' for '+Game.sayTime(time*Game.fps,-1)+'!',
				icon:[23,11],
				time:time*Game.fps,
				add:true,
				multCpS:pow,
				aura:2
            };
        });

        // Wrap vanilla functions
        let oldGainBuff = Game.gainBuff;
        Game.gainBuff = function(type,time,arg1,arg2,arg3) {
            var buff = oldGainBuff(type, time, arg1, arg2, arg3);
            buff.maxTime *=Game.eff('buffDur');
            buff.time *=Game.eff('buffDur');
            Game.recalculateGains = 1;
            return buff;
        };

        let oldComputeLumpTimes = Game.computeLumpTimes;
        Game.computeLumpTimes = function() {
            oldComputeLumpTimes();
            var hour=1000*60*60;
            Game.lumpRipeAge /= Game.eff('sugarLumpGrowth');
			Game.lumpOverripeAge=Game.lumpRipeAge+hour;
        };


        let oldGetHeavenlyMultiplier = Game.GetHeavenlyMultiplier;
        Game.GetHeavenlyMultiplier = function() {
            var heavenlyMult=oldGetHeavenlyMultiplier();
            heavenlyMult *= Game.eff('prestigeLevelCps');
            return heavenlyMult
        };

        let oldGetVeilBoost = Game.getVeilBoost;
        Game.getVeilBoost = function() {
            let boost = oldGetVeilBoost();
            boost *= Game.eff('shimmeringVeilBoost')
            return boost;
        };

        let oldGetVeilDefense = Game.getVeilDefense;
        Game.getVeilDefense = function() {
            let defense = oldGetVeilDefense();
            defense *= Game.eff('shimmeringVeilDefense')
            return defense;
        };

        let oldAuraMult = Game.auraMult;
        Game.auraMult = function(what) {
            let n = oldAuraMult(what);
            n*=Game.eff('dragonAura');
            return n;
        };

        let oldModifyBuildingPrice = Game.modifyBuildingPrice
        Game.modifyBuildingPrice = function(building, price) {
            price = oldModifyBuildingPrice(building, price);
            price *= Game.eff(String(building.name).toLowerCase() +'Cost');
            return price;
        };

        for (var i in Game.ObjectsById) {
            let object = Game.ObjectsById[i];
            let oldCps = object.cps;
            object.cps = function(me) {
                return oldCps(me) * Game.eff(String(object.name).toLowerCase() +'Cps');
            };

            let oldBuyFunction = object.buyFunction;
            object.buyFunction = function() {
                oldBuyFunction();
                if (object.minigame && object.minigameLoaded && object.minigame.buildingPurchased){object.minigame.buildingPurchased();}
            };
            
            let oldSellFunction = object.sellFunction?object.sellFunction:function(){};
            object.sellFunction = function() {
                oldSellFunction();
                if (object.minigame && object.minigameLoaded && object.minigame.buildingSold){object.minigame.buildingSold();}
            };
        };

        setTimeout(function() {
            Game.Notify('Loaded Moonworks\' more minigames!', "Thanks for checking it out! Please contact me if you have any issues, questions or suggestions. Currently adds a minigame for: <b>You</b>.<br>Version: "+MEMver, [9, 21]);
        }, 1500)
    },
    save:function(){
        //note: we use stringified JSON for ease and clarity but you could store any type of string
        var str = '';
        
        for (var i in Game.Objects)//buildings
        {
            var me=Game.Objects[i];
            if (me.id == 19)
            {
                if (Game.isMinigameReady(me)) str+=me.minigame.modSave()+','; else str+=(me.modMinigameSave||'')+',';
            }
            str+=';';
        }
        str+='|';

        console.log(str);

        return str;
    },
    load:function(str){
        var data = str;
        console.log(data);

        // Pray to heaven upon high that this works

        setTimeout(function() {
            var spl=data.split('|')[0];//buildings
            var spl2 = spl.split(';')
            for (var i in Game.ObjectsById)
            {
                var me=Game.ObjectsById[i];
                if (spl2[i])
                {
                    var mestr=spl2[i].toString().split(',');
                    if (me.minigame && me.minigame.isModded && me.minigameLoaded && me.minigame.reset) {me.minigame.reset(true);me.minigame.modLoad(mestr[0]||'');} else me.modSaveString=(mestr[0]||0);
                }
            }
        }, 1500); // Have to do this stupidness because for some reason the minigame isn't loaded when .load is called.
    },
});