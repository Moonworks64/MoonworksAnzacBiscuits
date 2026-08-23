// MOONWORKS EXTRA MINIGAMES MOD BEGIN
var MEMver = 0.1;
var isLocal = window.location.protocol=='http:';
var MEMdebug = isLocal;

var MMMImagePrefix = isLocal?'MoonworksAnzacBiscuits/img':'https://moonworks64.github.io/MoonworksAnzacBiscuits/img';

var modAchievementList = [];
var modUpgradeList = [];

Game.registerMod('MoonworksAnzacBiscuits',{
    init:function(){
        // Load minigames
        var you = Game.Objects['You'];
        you.minigameUrl = isLocal?'MoonworksAnzacBiscuits/minigameVats.js':'https://moonworks64.github.io/MoonworksAnzacBiscuits/minigameVats.js';
        you.minigameName = 'Cloning Facility';

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

        // New upgrades
        var startOfModNum = Game.UpgradesN;

        var vatsOrder = 23900;
        new Game.Upgrade('Synthesizer Mk II','Increases the synthesizer max time by <b>2 hours</b>.'+'<q>Uses DNA from licked post stamps for extra accuracy.</q>',12,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Combiner','Allows you to <b>combine two clones together</b>, albeit with risk.'+'<q>A very rough and haphazard procedure involving a magician, a sawblade, and two boxes.</q>',24,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Combiner Mk II','Increases the combiner max time by <b>2 hours</b>.'+'<q>Throws out half of your DNA for more efficient fusing.</q>',36,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Sacrificing','Allows you to <b>sacrifice buildings</b> to influence synthesized clones\' <b>personality and minimum potential</b>.'+'<q>Liquidize your masses of real estate and solid assets into pure, biological enhancement! Majority of it is transformed into carbs though.</q>',48,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Synthesizer Mk III','Increases the synthesizer max time by <b>3 hours</b>.<br>Synthesizing for at least 6 hours has a <b>10% chance</b> to <b>increase upgrade rolls by 1</b>.'+'<q>Proteins are folded then ironed so they\'re not as wrinkly.</q>',60,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Combiner Mk III','Increases the combiner max time by <b>3 hours</b>.<br>Combining for at least 6 hours has a <b>10% chance</b> to <b>increase potential by 5%</b>.'+'<q>Allows time for a business dinner so the clones get to know eachother before the fusion.</q>',72,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Upgrade('Synthesizer Mk IV', 'Increases the synthesizer max time by <b>6 hours</b>.<br>Synthesizing for at least 12 hours has a <b>5% chance</b> to <b>upgrade all genes</b>.'+'<q>We\'ve figured out how the very essence of life is created! Now it\'s shoved into this machine and lets us synthesize clones with even more efficiency.</q>',84,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Combiner Mk IV','Increases the combiner max time by <b>6 hours</b>.<br>Combining for at least 12 hours has a <b>5% chance</b> to <b>not reduce fusions remaining</b>.'+'<q>A new breakthrough has occured, and now we\'re able to simply make a clone believe they\'ve fused with another clone. Placebo is one hell of a science.</q>',96,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Contractor Clones','Allows you to contract clones to gain <b>permanent buffs</b> for their personality type.'+'<q>Owning a universe-spanning cookie business means you get quite a lot of attention, people and aliens from everywhere imagineable are mailing contracts asking that you use your expertise and skills to work on their own non-cookie related ventures. Despite them confusing that your expertise and skills extend to anything beyond cookie manufacturing (and more importantly the idea of working on anything else making you light-headed), you figure that you could just send clones specifically grown to meet their request instead. Even if it is some effort, the publicity and experience of making specially-designed clones is probably worth it.</q>',108,[2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder+1;
		
        var vatsUpgrades=['Synthesizer Mk II', 'Combiner', 'Combiner Mk II', 'Sacrificing', 'Synthesizer Mk III', 'Combiner Mk III', 'Synthesizer Mk IV', 'Combiner Mk IV', 'Contractor Clones'];
        for (var i in vatsUpgrades)//scale by CpS
		{
			var it=Game.Upgrades[vatsUpgrades[i]];
			it.priceFunc=function(cost){return function(){return cost*Game.cookiesPs*60*60;}}(it.basePrice);
			it.baseDesc=it.baseDesc.replace('<q>','<br>'+loc("Cost scales with CpS.")+'<q>');
			it.desc=BeautifyInText(it.baseDesc);
		}

        for (var i = startOfModNum; Game.UpgradesById[i] != undefined; i++) {
            modUpgradeList.push(Game.UpgradesById[i].name);
        };

        // New achievements
        var startOfModNum = Game.AchievementsN;

        var vatsOrder = 61915;
        new Game.Achievement('I think I\'m a clone now', "Create a clone.",[0,0, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Two\'s a party but 50 is a crowd', "Create <b>50</b> clones."+'<q>3 is really not that many people.</q>',[2,0, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Be the best You', "Create <b>500</b> clones."+'<q>Is it really "Self-Improvement" if they\'re your clone?</q>', [4,0, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Achievement('Not-so-specialized cells', 'Create a clone with <b>at least 12 genes</b>.', [2,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Weakest link', 'Create a clone with only negative genes.'+'<q>We could certainly go with missing this one!</q>', [4,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Autoimmune', 'Destroy a clone.', [3,2, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Skipping the fine print', 'Sign <b>25 contracts</b> for a clone personality.', [0,1, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Plundering paper pirates', 'Convert your signed clone contract records into sugar lumps by having your filing cabinets raided by lawyers.<div class=\"line\"></div>Owning this achievement makes clone personalities have <b>5% greater</b> favoured gene bonus, the synthesizer and combiner <b>10% cheaper</b>, and synthesizer and combiner random events <b>5% more</b> likely to occur.'+'<q>What do those lawyers even want those records for? Any lawsuit they send you for clone rights abuses costs less than 5% of your weekly income to pay off.</q>', [5,0, MMMImagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;

        for (var i = startOfModNum; Game.AchievementsById[i] != undefined; i++) {
            modAchievementList.push(Game.AchievementsById[i].name);
        };

        LocalizeUpgradesAndAchievs();

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
            }
        );

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
        };

        setTimeout(function() {
            Game.Notify('Loaded Moonworks\' Anzac Biscuits!', "Thanks for checking it out! Please contact me if you have any issues, questions or suggestions. Currently adds a minigame for: <b>You (Cloning Facility)</b>.<br>Version: "+MEMver, [9, 21]);
        }, 1500)
    },
    save:function(){
        //note: we use stringified JSON for ease and clarity but you could store any type of string
        var str = '';
        var version = MEMver;
        str+=version+';';
        str+='|'; // achievements
        for (var i in modAchievementList) {
            var me=Game.Achievements[modAchievementList[i]];
            if (me) {
                str+=modAchievementList[i]+',';
                str+=Math.min(me.won);
                str+=';';
            };
        };
        str+='|'; // upgrades
        for (var i in modUpgradeList) {
            var me=Game.Upgrades[modUpgradeList[i]];
            if (me) {
                str+=modUpgradeList[i]+',';
                str+=Math.min(me.unlocked)+',';
                str+=Math.min(me.bought);
                str+=';';
            };
        };
        str+='|'; //buildings
         for (var i in Game.Objects)
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
            var spl = data.split('|')[0]; // general
            var spl2 = spl.split(';')
            var version = spl2[0]
            spl = data.split('|')[1]; // achievements
            spl2 = spl.split(';')
            for (var i in modAchievementList)
            {
                var mestr=spl2[i].split(',');
                var me=Game.Achievements[mestr[0]];
                if (me) {
                    if (spl2[i])
                    {
                        me.won=parseInt(mestr[1]);
                    }
                    else
                    {
                        me.won=0;
                    };
                    if (me.won && Game.CountsAsAchievementOwned(me.pool)) Game.AchievementsOwned++;
                };
            };
            spl = data.split('|')[2]; // upgrades
            spl2 = spl.split(';')
            for (var i in modUpgradeList)
            {
                var mestr=spl2[i].split(',');
                var me=Game.Upgrades[mestr[0]];
                if (me) {
                    if (spl2[i])
                    {  
                        me.unlocked=parseInt(mestr[1]);me.bought=parseInt(mestr[2]);
                        if (me.bought && Game.CountsAsUpgradeOwned(me.pool)) Game.UpgradesOwned++;
                    }
                    else
                    {
                        me.unlocked=0;me.bought=0;
                    };
                };
            };
            spl=data.split('|')[3];//buildings
            spl2 = spl.split(';')
            for (var i in Game.ObjectsById)
            {
                var me=Game.ObjectsById[i];
                if (spl2[i])
                {
                    var mestr=spl2[i].toString().split(',');
                    if (me.minigame && me.minigame.isModded && me.minigameLoaded && me.minigame.reset) {me.minigame.reset(true);me.minigame.modLoad(mestr[0]||'');} else me.modSaveString=(mestr[0]||0);
                }
            };
        }, 1500); // Have to do this stupidness because for some reason the minigame isn't loaded when .load is called.
    },
});