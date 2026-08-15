// MOONWORKS EXTRA MINIGAMES MOD BEGIN
const MEMver = "You alpha";
const debug = 1;

Game.registerMod('MoonworksExtraMinigames',{
    init:function(){
        // Load minigames
        var you = Game.Objects['You'];
        you.minigameUrl = 'MoreMinigames/minigameVats.js';
        you.minigameName = 'Incubator Vats';
        you.switchMinigame(1);

        Game.LoadMinigames();

        if (debug) {
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

        // Wrap vanilla functions
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
            Game.Notify('Loaded Moonworks\' extra minigames!', "Thanks for checking it out! Please contact me if you have any issues, questions or suggestions.<br>Version: "+MEMver, [9, 21]);
        }, 1500)
    },
    save:function(){
        //note: we use stringified JSON for ease and clarity but you could store any type of string
        return JSON.stringify({testSave:"test saving stuff"})
    },
    load:function(str){
        var data = JSON.parse(str);
        if (data.text) {
            Game.Popup(testSave, Game.mouseX,Game.mouseY);
        }
    },
});