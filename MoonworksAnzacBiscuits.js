// MOONWORKS EXTRA MINIGAMES MOD BEGIN
var mod = {}

mod = {
    init:function(){
        var mod = this;

        // Basic mod data
        mod.version = 0.11;
        mod.imagePrefix = Game.local?'MoonworksAnzacBiscuits/img':'https://moonworks64.github.io/MoonworksAnzacBiscuits/img';
        mod.modString = `Game.mods['MoonworksAnzacBiscuits']`;
        mod.modAchievementList = [];
        mod.modUpgradeList = [];

        // Helper functions
        mod.makeUpgradeHeavenly = function(upgrade, position, parents) {
            upgrade.pool='prestige';
            upgrade.parents=parents;
            for (var ii in upgrade.parents) {upgrade.parents[ii]=Game.Upgrades[upgrade.parents[ii]];}
            upgrade.posX=position[0];
            upgrade.posY=position[1];
            Game.PrestigeUpgrades.push(upgrade);
        };  

        // Injections
        Game.computeLumpTimes = new Function('return ' + Game.computeLumpTimes.toString().replace(
            `Game.lumpOverripeAge=Game.lumpRipeAge+hour;`, 
            `Game.lumpRipeAge /= Game.eff('sugarLumpGrowth');Game.lumpOverripeAge=Game.lumpRipeAge+hour;`)
        )();
        
        Game.GetHeavenlyMultiplier = new Function('return ' + Game.GetHeavenlyMultiplier.toString().replace(
            `if (Game.Has('Lucky payout')) heavenlyMult*=1.01;`, 
            `if (Game.Has('Lucky payout')) heavenlyMult*=1.01;heavenlyMult *= Game.eff('prestigeLevelCps');`)
        )();

        Game.getVeilBoost = new Function('return ' + Game.getVeilBoost.toString().replace(
            `if (Game.Has('Glittering edge')) n+=0.05;`, 
            `if (Game.Has('Glittering edge')) n+=0.05;n *= Game.eff('shimmeringVeilBoost');`)
        )();

        Game.getVeilDefense = new Function('return ' + Game.getVeilDefense.toString().replace(
            `if (Game.Has('Glittering edge')) n+=0.1;`, 
            `if (Game.Has('Glittering edge')) n+=0.1;n *= Game.eff('shimmeringVeilDefense');`)
        )();

        Game.auraMult = new Function('return ' + Game.auraMult.toString().replace(
            `return n;`, 
            `n *= Game.eff('dragonAura');return n;`)
        )();

        Game.modifyBuildingPrice = new Function('return ' + Game.modifyBuildingPrice.toString().replace(
            `if (Game.hasBuff('Nasty goblins')) price*=1.02;`, 
            `if (Game.hasBuff('Nasty goblins')) price*=1.02;price *= Game.eff(String(building.name).toLowerCase() +'Cost');`)
        )();

        for (var i in Game.ObjectsById) {
            let object = Game.ObjectsById[i];
            object.cps = new Function('return ' + object.cps.toString().replace(
                `mult*=Game.GetTieredCpsMult(me);`, 
                `mult*=Game.GetTieredCpsMult(me);mult *= Game.eff(String(me.name).toLowerCase() +'Cps');`)
            )();
        };

        // Load minigames
        var you = Game.Objects['You'];
        you.minigameUrl = Game.local?'MoonworksAnzacBiscuits/minigameVats.js':'https://moonworks64.github.io/MoonworksAnzacBiscuits/minigameVats.js';
        you.minigameName = 'Cloning Facility';

        Game.LoadMinigames();

        // New upgrades
        var startOfModNum = Game.UpgradesN;

        mod.makeUpgradeHeavenly(
            new Game.Upgrade('Hidden sugar','Gain 1 sugar lump.'+'<q>A rare sight - a fully grown sugar lump floating through the aether. Rumours have it that this one only appears when your prestige level contains a 9\'s.</q>',999999,[29,14]),
            [191,725],
            ['Golden cookie alert sound']
        );
        Game.last.showIf=function(){return (Math.ceil(((Game.prestige+'').split('9').length-1))>=1);};
        Game.last.buyFunction = function() {Game.gainLumps(1);};

        mod.makeUpgradeHeavenly(
            new Game.Upgrade('Secret sugar','Gain 1 sugar lump.'+'<q>A rare sight - a fully grown sugar lump floating through the aether. This sugar lump is quite small and timid, and will only show itself when your prestige level contains three 9\'s.</q>',99,[29,14]),
            [217,-121],
            ['Persistent memory']
        );
        Game.last.showIf=function(){return (Math.ceil(((Game.prestige+'').split('9').length-1))>=3);};
        Game.last.buyFunction = function() {Game.gainLumps(1);};

        mod.makeUpgradeHeavenly(
            new Game.Upgrade('Clandestine sugar','Gain 2 sugar lumps.'+'<q>An incredibly rare sight - a fully grown bifuricated sugar lump floating through the aether. This sugar lump is incredibly elusive, and will only show up when your prestige level contains five 9\'s.</q>',999999999999999,[29,15]),
            [66,-1525],
            ['Sucralosia Inutilis']
        );
        Game.last.showIf=function(){return (Math.ceil(((Game.prestige+'').split('9').length-1))>=5);};
        Game.last.buyFunction = function() {Game.gainLumps(2);};
        
        var vatsOrder = 23900;
        new Game.Upgrade('Synthesizer Mk II','Increases the synthesizer max time by <b>2 hours</b>.'+'<q>Uses DNA from licked post stamps for extra accuracy.</q>',1,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Combiner','Allows you to <b>combine two clones together</b>, albeit with risk.'+'<q>A very rough and haphazard procedure involving a magician, a sawblade, and two boxes.</q>',2,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Combiner Mk II','Increases the combiner max time by <b>2 hours</b>.'+'<q>Throws out half of your DNA for more efficient fusing.</q>',3,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Sacrificing','Allows you to <b>sacrifice buildings</b> to influence synthesized clones\' <b>personality and minimum potential</b>.'+'<q>Liquidize your masses of real estate and solid assets into pure, biological enhancement! Majority of it is transformed into carbs though.</q>',4,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Synthesizer Mk III','Increases the synthesizer max time by <b>3 hours</b>.<br>Synthesizing for at least 6 hours has a <b>10% chance</b> to <b>increase upgrade rolls by 1</b>.'+'<q>Proteins are folded then ironed so they\'re not as wrinkly.</q>',5,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Combiner Mk III','Increases the combiner max time by <b>3 hours</b>.<br>Combining for at least 6 hours has a <b>10% chance</b> to <b>increase potential by 5%</b>.'+'<q>Allows time for a business dinner so the clones get to know eachother before the fusion.</q>',6,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Upgrade('Synthesizer Mk IV', 'Increases the synthesizer max time by <b>6 hours</b>.<br>Synthesizing for at least 12 hours has a <b>5% chance</b> to <b>upgrade all genes</b>.'+'<q>We\'ve figured out how the very essence of life is created! Now it\'s shoved into this machine and lets us synthesize clones with even more efficiency.</q>',7,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Combiner Mk IV','Increases the combiner max time by <b>6 hours</b>.<br>Combining for at least 12 hours has a <b>5% chance</b> to <b>not reduce fusions remaining</b>.'+'<q>A new breakthrough has occured, and now we\'re able to simply make a clone believe they\'ve fused with another clone. Placebo is one hell of a science.</q>',8,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Upgrade('Contractor Clones','Allows you to contract clones to gain <b>permanent buffs</b> for their personality type.'+'<q>Owning a universe-spanning cookie business means you get quite a lot of attention, people and aliens from everywhere imagineable are mailing contracts asking that you use your expertise and skills to work on their own non-cookie related ventures. Despite them confusing that your expertise and skills extend to anything beyond cookie manufacturing (and more importantly the idea of working on anything else making you light-headed), you figure that you could just send clones specifically grown to meet their request instead. Even if it is some effort, the publicity and experience of making specially-designed clones is probably worth it.</q>',9,[2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder+1;
		
        var vatsUpgrades=['Synthesizer Mk II', 'Combiner', 'Combiner Mk II', 'Sacrificing', 'Synthesizer Mk III', 'Combiner Mk III', 'Synthesizer Mk IV', 'Combiner Mk IV', 'Contractor Clones'];
        for (var i in vatsUpgrades)//scale by CpS
		{
			var it=Game.Upgrades[vatsUpgrades[i]];
			it.priceFunc=function(cost){return function(){return cost*Game.cookiesPs*60*60*24*7;}}(it.basePrice);
			it.baseDesc=it.baseDesc.replace('<q>','<br>'+loc("Cost scales with CpS.")+'<q>');
			it.desc=BeautifyInText(it.baseDesc);
		};

        for (var i = startOfModNum; Game.UpgradesById[i] != undefined; i++) {
            mod.modUpgradeList.push(Game.UpgradesById[i].name);
        };

        // New achievements
        var startOfModNum = Game.AchievementsN;

        var vatsOrder = 61915;
        new Game.Achievement('I think I\'m a clone now', "Create a clone.",[0,0, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Two\'s a party but 50 is a crowd', "Create <b>50</b> clones."+'<q>3 is really not that many people.</q>',[2,0, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Be the best You', "Create <b>500</b> clones."+'<q>Is it really "Self-Improvement" if they\'re your clone?</q>', [4,0, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
		new Game.Achievement('Not-so-specialized cells', 'Create a clone with <b>at least 12 genes</b>.', [2,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Weakest link', 'Create a clone with only negative genes.'+'<q>We could certainly go with missing this one!</q>', [4,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Autoimmune', 'Destroy a clone.', [3,2, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Skipping the fine print', 'Sign <b>25 contracts</b> for a clone personality.', [0,1, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;
        new Game.Achievement('Plundering paper pirates', 'Convert your signed clone contract records into sugar lumps by having your filing cabinets raided by lawyers.<div class=\"line\"></div>Owning this achievement makes clone personalities have <b>5% greater</b> favoured gene bonus, therapies, synthesizer and combiner <b>5% cheaper</b>, and synthesizer and combiner random events <b>5% more</b> likely to occur.'+'<q>What do those lawyers even want those records for? Any lawsuit they send you for clone rights abuses costs less than 5% of your weekly income to pay off.</q>', [5,0, mod.imagePrefix + '/vatsClones.png']); Game.last.order = vatsOrder;

        for (var i = startOfModNum; Game.AchievementsById[i] != undefined; i++) {
            mod.modAchievementList.push(Game.AchievementsById[i].name);
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
        });

        // Load Moonwork's New Tiers
        if (!Game.mods['MoonworksNewTiers']) {
            Game.LoadMod('https://moonworks64.github.io/MoonworksNewTiers/MoonworksNewTiers.js');
        } else Game.mods['MoonworksNewTiers'].updateAchievShadow();

        setTimeout(function(){
            Game.Notify('Loaded Moonwork\'s Anzac Biscuits!', "Thanks for checking it out! Please contact me if you have any issues, questions, confusions or suggestions. Currently adds a minigame for: <b>You (Cloning Facility)</b>.<br>Version: "+mod.version, [9, 21]);
        }, 1600)
    },
    save:function(){
        var mod = this;
        //note: we use stringified JSON for ease and clarity but you could store any type of string
        var toSave = {};
        toSave.version = mod.version;
        toSave.achievements = {};
        for (var i in mod.modAchievementList) {
            var me=Game.Achievements[mod.modAchievementList[i]];
            if (me) {
                toSave.achievements[mod.modAchievementList[i]] = {won: Math.min(me.won)};
            };
        };
        toSave.upgrades = {};
        for (var i in mod.modUpgradeList) {
            var me=Game.Upgrades[mod.modUpgradeList[i]];
            if (me) {
                toSave.upgrades[mod.modUpgradeList[i]] = {
                    unlocked: Math.min(me.unlocked),
                    bought: Math.min(me.bought)
                };
            };
        };
        toSave.buildingMinigames = {};
        for (var i in Game.Objects)
        {
            var me=Game.Objects[i];
            if (me.minigame && me.minigame.isModded && Game.isMinigameReady(me)) {
                toSave.buildingMinigames[me.name] = me.minigame.modSave(); 
            } else toSave.buildingMinigames[me.name]=(me.modMinigameSave||'');
        };

        return JSON.stringify(toSave);
    },
    load:function(str){
        var mod = this;
        var data = JSON.parse(str);
        console.log(data);

        setTimeout(function() {
            var savedVersion = data.version;
            if (!savedVersion || savedVersion <= 0.1) return;
            var savedAchievements = data.achievements;
            for (var i in mod.modAchievementList)
            {
                var name = mod.modAchievementList[i];
                var me=Game.Achievements[name];
                if (me) {
                    if (savedAchievements[name])
                    {
                        me.won=savedAchievements[name].won||0;
                    }
                    else
                    {
                        me.won=0;
                    };
                    if (me.won && Game.CountsAsAchievementOwned(me.pool)) Game.AchievementsOwned++;
                };
            };
            var savedUpgrades = data.upgrades;
            for (var i in mod.modUpgradeList)
            {
                var name = mod.modUpgradeList[i];
                var me=Game.Upgrades[name];
                if (me) {
                    if (savedUpgrades[name])
                    {  
                        me.unlocked=savedUpgrades[name].unlocked||0;
                        me.bought=savedUpgrades[name].bought||0;
                        if (me.bought && Game.CountsAsUpgradeOwned(me.pool)) Game.UpgradesOwned++;
                    }
                    else
                    {
                        me.unlocked=0;me.bought=0;
                    };
                };
            };
            var savedBuildingMinigames = data.buildingMinigames;
            for (var i in Game.ObjectsById)
            {
                var me=Game.ObjectsById[i];
                if (savedBuildingMinigames[me.name] && savedBuildingMinigames[me.name]!='')
                {
                    if (me.minigame && me.minigame.isModded && me.minigameLoaded && me.minigame.reset) {
                        me.minigame.reset(true);
                        me.minigame.modLoad(savedBuildingMinigames[me.name]||'');
                    } else me.modSaveString=(savedBuildingMinigames[me.name]||0);
                }
            };

            Game.upgradesToRebuild=1;
        }, 1500); // Have to do this stupidness because for some reason the minigame isn't loaded when .load is called.
    },
};

Game.registerMod('MoonworksAnzacBiscuits',mod);
var mod = 0;