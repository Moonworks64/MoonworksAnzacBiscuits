/*
Hello this is my awful code
I don't really know what I'm doing so if there's a better way to set this all up I wouldn't know it - honestly if you're bothered please give me feedback because this was a pain to make
I am physically wrestling with CSS how does anything work
@Moonworks_
*/

var minigameBuildingName = 'You'
if(Game.Objects[minigameBuildingName].minigame) throw new Error("Vats prevented from loading by already present You minigame.");

var M = {};
M.parent = Game.Objects[minigameBuildingName];
M.parent.minigame = M;

M.launch = function(){
	var M = this;
	
	M.init = function(div){
		// runs when loaded - not opened, loaded, like game load

		//populate div with html and initialize values

		M.mangleSentences = function(sentences) {
			var newSentence = '';
            var words = [];
			for (var i in sentences) {
				words = words.concat(sentences[i].split(' '));
			};

    		shuffle(words);
			
            for (var ii = 0; ii<=1+Math.random()*(words.length-2); ii++) {
                newSentence += words[ii] + ' ';
            };
			return newSentence;
		};

		M.linearTransformNumber = function(num1, num2, alpha) {
			return num1 + ((num2-num1) * alpha)
		};

		M.linearTransformTable = function(table, alpha) {
			return M.linearTransformNumber(table[0], table[1], alpha)
		}

		M.getTotalWeight = function(table) {
			var totalWeight = 0;
			
			for (var i in table) {
				totalWeight += table[i].weight
			};

			return totalWeight
		};

		M.weightedRandom = function(table) {
			var totalWeight = M.getTotalWeight(table);
			
			var chance = Math.random() * totalWeight;
 			var c = 0;
			for (var i in table) {
				c += table[i].weight;
				if (chance <= c) {
					return i
				};
			};
			return
		};

		M.clones = {};
		M.clonesN = 0;
		M.lastClone = 0;
		M.creationNum = 0;

		M.tickDur = MEMdebug?0.1:(3 * 60); // 3 minutes so 20 ticks = 1 hour
		M.nextTick = Date.now() + (M.tickDur * 1000);
		
		M.toCompute = false;
		M.updateGraphics = false;

		M.youStats = {};

		M.topShelfSize = 140;
		
		M.baseStatNegativeChance = [0.6, 0.4];
		M.bonusBaseStatsMin = 1;
		M.bonusBaseStatMod = 0.6;
		M.favouredWeightMult = 1.5;
		M.favouredPowerMult = 1.5;
		M.baseUpgradeRolls = 5;
		M.upgradeRollsMin = 1
		M.baseUpgradePower = 1;
		M.upgradePowerMin = 0.1;
		M.statWeightMin = 0;
		
		M.ageBrackets = [0, 20*1, 20*3, 20*6, 20*12]; //In ticks // Please for the love of me not having to change a bunch of numbers, do not change these
		M.ageNames = ['Baby', 'Toddler', 'Child', 'Teenager', 'Adult'];
		
		M.storageVatNum = 6;
		M.vats = [];
		M.vatsN = 0;

		M.binTicksRemaining = -1;
		M.binTickCooldown = 5;
		M.bin = {canBePickedUp:1};

		M.combinerTicksRemaining = -1;
		M.combinerTotalTicks = -1;

		M.combinerCpSCostPerTick = 30;
		M.combinerDestroyChanceMin = 0.15;
		M.combinerDestroyChanceMax = 0.9;
		M.combinerDestroyChanceLevelMod = 9;

		M.synthesizerSacPool = {};
		M.synthesizerDuration = -1;
		M.synthesizerTicksRemaining = -1;

		M.synthesizerCpSCostPerTick = 60;
		M.synthesizerMinPotentialMin = 0;
		M.synthesizerMinPotentialMax = 0.95;
		M.synthesizerMinPotentialLevelMod = 49;
		M.synthesizerMinPotentialSacrificePowerLevelEquivalent = 0.02; // *500 = +10 effective levels at max sac, *500 because 1x of each building = 1 sac power, and a max of 500 each building can be sacced = 500 max sac power
		
		M.sacPool = {};
		M.sacMax = 500;
		M.sacLikeWeightMult = 15; // Sacrifice favoured personalities are 15x more likely when sacrificing the max of that building
		M.sacSelected = 0;
		M.sacAmountOld = 1;
		M.sacAddAmount = 1;
		M.sacBulkShortcutOn = 0;
		M.sacButtonsInfo = { // Probably hack as hell but oh well
			'vatsSacSelected': function(amount, building, plural, icon) {var personalityLikes = ''; for (var i in M.personalities) {var personality = M.personalities[i]; if (personality.sacLike && personality.sacLike.toLocaleLowerCase() == building.toLocaleLowerCase()) {personalityLikes += personality.name};}; return (personalityLikes==''?undefined:'Sacrificing '+icon+' <b>'+plural+'</b> increases the chance of synthesizing a clone with <b>'+personalityLikes+'</b> as their personality.')},
			'vatsSacGoRight': function(amount, building, plural, icon) {return 'Click to go to next sacrifice option.'},
			'vatsSacGoLeft': function(amount, building, plural, icon) {return 'Click to go to previous sacrifice option.'},
			'vatsSacAdd': function(amount, building, plural, icon) {return 'Click to add <b>'+amount+' '+icon+' '+building+'</b> to the sacrifice.<br>Hold shift to add 100.<br>Hold Ctrl to add 10.'},
			'vatsSacAddAll': function(amount, building, plural, icon) {return 'Click to add <b>'+amount+'</b> of <b>every building</b> to the sacrifice.<br>Hold shift to add 100.<br>Hold Ctrl to add 10.'},
			'vatsSacRemove': function(amount, building, plural, icon) {return 'Click to remove <b>'+amount+' '+icon+' '+building+'</b> from the sacrifice.<br>Hold shift to remove 100.<br>Hold Ctrl to remove 10.'},
			'vatsSacRemoveAll': function(amount, building, plural, icon) {return 'Click to remove all your '+icon+' <b>'+plural+'</b> from the sacrifice.'},
			'vatsSacReset': function(amount, building, plural, icon) {return 'Click to reset your sacrifice.'},
		};
		M.sacButtonsFunctions = {
			'vatsSacGoRight': function(value){M.sacSelected++;return value;},
			'vatsSacGoLeft': function(value){M.sacSelected--;return value;},
			'vatsSacAdd': function(value){return value+M.sacAddAmount;},
			'vatsSacAddAll': function(value){for (var i in M.buildingList) {var building = M.buildingList[i]; M.sacPool[building] = (M.sacPool[building]?M.sacPool[building]+M.sacAddAmount:M.sacAddAmount);}; return value+M.sacAddAmount;},
			'vatsSacRemove': function(value){return value-M.sacAddAmount;},
			'vatsSacRemoveAll': function(value){return 0;},
			'vatsSacReset': function(value){M.sacPool={};return value;},
		};

		M.buildingList = ['Cursor', 'Grandma', 'Farm', 'Mine', 'Factory', 'Bank', 'Temple', 'Wizard tower', 'Shipment', 'Alchemy lab', 'Portal', 'Time machine', 'Antimatter condenser', 'Prism', 'Chancemaker', 'Fractal engine', 'Javascript console', 'Idleverse', 'Cortex baker', 'You']

		/*
			RULE OF THUMBS:
			Standard weight = 1;
			Standard increase = 0.000001 (generally *100 (For number of You's) to estimate it's effect on a full You battalion, this is 0.0001 = 0.01%)
		*/
		M.sC = M.favouredPowerMult * 100 * 100 * (1/5); // statCompensation, favoured stats get higher power, Number of yous * %
		M.stats = {
			'cps':{
				weight:1, // Weight it'll be chosen as a bonus stat
				upgradeWeight:[0.5,1], // Weight it'll be upgraded at min / max potential
				upgradePower:[0.01/M.sC,0.015/M.sC], // Write in % + expected buff for favoured stats at 100 You's + upgrades, Upgrade power at min / max potential
				statStr:loc('CpS'), // String displayed between &bull and the effect
			},
			'click':{
				weight:1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.05/M.sC,0.075/M.sC],
				statStr:loc('cookies/click'),
			},
			'goldenCookieGain':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('golden cookie gains'),
			},
			'goldenCookieFreq':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.05/M.sC,0.075/M.sC],
				statStr:loc('golden cookie frequency'),
			},
			'goldenCookieDur':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('golden cookie duration'),
			},
			'goldenCookieEffDur':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.05/M.sC,0.075/M.sC],
				statStr:loc('golden cookie effect duration'),
			},
			'wrathCookieGain':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('wrath cookie gains'),
			},
			'wrathCookieFreq':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.05/M.sC,0.075/M.sC],
				statStr:loc('wrath cookie frequency'),
			},
			'wrathCookieDur':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('wrath cookie duration'),
			},
			'wrathCookieEffDur':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.05/M.sC,0.075/M.sC],
				statStr:loc('wrath cookie effect duration'),
			},
			'reindeerGain':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('reindeer gains'),
			},
			'reindeerFreq':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.05/M.sC,0.075/M.sC],
				statStr:loc('reindeer frequency'),
			},
			'reindeerDur':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('reindeer duration'),
			},
			'itemDrops':{
				weight:1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.2/M.sC,0.4/M.sC],
				statStr:loc('item drops'),
			},
			'wrinklerSpawn':{
				weight:1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('wrinkler spawn rate'),
			},
			'wrinklerEat':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('wrinkler appetite'),
			},
			'milk':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.01/M.sC,0.015/M.sC],
				statStr:loc('milk effects'),
			},
			'sugarLumpGrowth':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.01/M.sC,0.015/M.sC],
				statStr:loc('sugar lump growth rate'),
			},
			'prestigeLevelCps':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('prestige level effect on CpS'),
			},
			'shimmeringVeilBoost':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('shimmering veil effectiveness'),
			},
			'shimmeringVeilDefense':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('shimmering veil defense'),
			},
			'dragonAura':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[0.05/M.sC,0.075/M.sC],
				statStr:loc('dragon aura effectiveness'),
			},
			'upgradeCost':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[-0.01/M.sC,-0.015/M.sC],
				statStr:loc('upgrade cost'),
			},
			'buildingCps':{
				weight:0.5,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc('building CpS'),
			},
			'buildingCost':{
				weight:0.1,
				upgradeWeight:[0.5,1],
				upgradePower:[-0.01/M.sC,-0.015/M.sC],
				statStr:loc('building cost'),
			},
		};

		for (var i in M.buildingList) {
			var building = M.buildingList[i];
			building = building.toLocaleLowerCase();
			M.stats[building+'Cps'] = {
				weight:0.05,
				upgradeWeight:[0.5,1],
				upgradePower:[0.1/M.sC,0.15/M.sC],
				statStr:loc(building+' CpS'),
			};
			M.stats[building+'Cost'] = {
				weight:0.05,
				upgradeWeight:[0.5,1],
				upgradePower:[-0.01/M.sC,-0.015/M.sC],
				statStr:loc(building+' cost'),
			};
		};

		M.personalities = {
			'aspirational':{
				name:'Aspirational', // Name
				weight:0.1, // Weight it'll be chosen for the personality
				favouredStats:{'cps':[1,1], 'click':[0.5, 0.75], "milk":[0.01,0.05]}, // Base stats, % chance it'll be a base stat at min / max potential
			},
			'jolly':{
				name:'Jolly',
				weight:0.1,
				favouredStats:{'cps':[1,1], 'reindeerGain':[1,1], "reindeerDur":[0.5,0.75], 'reindeerFreq':[0.1, 0.2]},
			},
			'creative':{
				name:'Creative',
				weight:0.1,
				favouredStats:{'buildingCps':[1,1], 'itemDrops':[0.5, 0.75]},
			},
			'fidgety':{
				name:'Fidgety',
				weight:0.05,
				sacLike:'Cursor',
				favouredStats:{'cursorCps':[1,1], 'cursorCost':[0.5, 0.6], "click":[0.5,0.8]},
				quote:'They\'re unable to sit still without having something to fiddle with in their unconscious attempts to relieve stress.',
			},
			'senile':{
				name:'Senile',
				weight:0.05,
				sacLike:'Grandma',
				favouredStats:{'grandmaCps':[1,1], 'grandmaCost':[0.5, 0.6], "wrinklerEat":[0.1, 0.2]},
				quote:'Emotionally speaking, they\'re going through the autumnal years of their life - some of us age faster than others.',
			},
			'peaceful':{
				name:'Peaceful',
				weight:0.05,
				sacLike:'Farm',
				favouredStats:{'farmCps':[1,1], 'farmCost':[0.5, 0.6], 'shimmeringVeilBoost':[0.1, 0.2]},
				quote:'Their ideal afternoon is spent residing in the quite soundscapes of the countryside.',
			},
			'withdrawn':{
				name:'Withdrawn',
				weight:0.05,
				sacLike:'Mine',
				favouredStats:{'mineCps':[1,1], 'mineCost':[0.5, 0.6], 'buildingCost':[0.1, 0.2]},
				quote:'They don\'t see much point in going out when everyone they can talk to is an identical clone of them.',
			},
			'inquisitive':{
				name:'Inquisitive',
				weight:0.05,
				sacLike:'Factory',
				favouredStats:{'factoryCps':[1,1], 'factoryCost':[0.5, 0.6], 'upgradeCost':[0.1, 0.2]},
				quote:'Always eager to dive into a book they\'ve never heard of, every new idea captivates them.',
			},
			'slyful':{
				name:'Slyful',
				weight:0.05,
				sacLike:'Bank',
				favouredStats:{'bankCps':[1,1], 'bankCost':[0.5, 0.6], 'wrathCookieEffDur':[0.1, 0.2]},
				quote:'They\'re a terrible penny-pincher, they\'ll use every con in the book to wrangle money out of someone.',
			},
			'idolatrous ':{
				name:'Idolatrous',
				weight:0.05,
				sacLike:'Temple',
				favouredStats:{'templeCps':[1,1], 'templeCost':[0.5, 0.6], 'goldenCookieFreq':[0.1, 0.2]},
				quote:'They\'ve chosen to dedicate their life to the cookie gods. It brings them some peace of mind.',
			},
			'spiritual':{
				name:'Spiritual',
				weight:0.05,
				sacLike:'Wizard tower',
				favouredStats:{'wizard towerCps':[1,1], 'wizard towerCost':[0.5, 0.6], 'prestigeLevelCps':[0.1, 0.2]},
				quote:'Auras, crystals, mana circles - the whole lot, they\'re into it.',
			},
			'worldly':{
				name:'Worldly',
				weight:0.05,
				sacLike:'Shipment',
				favouredStats:{'shipmentCps':[1,1], 'shipmentCost':[0.5, 0.6], 'dragonAura':[0.1, 0.2]},
				quote:'They love to travel and experience new cultures, staying in one place isn\'t for them.',
			},
			'inattentive':{
				name:'Inattentive',
				weight:0.05,
				sacLike:'Alchemy lab',
				favouredStats:{'alchemy labCps':[1,1], 'alchemy labCost':[0.5, 0.6], 'milk':[0.1, 0.2]},
				quote:'They have trouble focusing on one thing before a new thought enters their mind.',
			},
			'eccentric':{
				name:'Eccentric',
				weight:0.05,
				sacLike:'Portal',
				favouredStats:{'portalCps':[1,1], 'portalCost':[0.5, 0.6], 'wrathCookieDur':[0.1, 0.2]},
				quote:'Despite being a clone, they do stand out quite a bit with some of their life choices.',
			},
			'nostalgic':{
				name:'Nostalgic',
				weight:0.05,
				sacLike:'Time machine',
				favouredStats:{'time machineCps':[1,1], 'time machineCost':[0.5, 0.6], 'goldenCookieEffDur':[0.1, 0.2]},
				quote:'Always dreaming of their younger days - surrounded by lab equipment and gene arrays.',
			},
			'apathetic':{
				name:'Apathetic',
				weight:0.05,
				sacLike:'Antimatter condenser',
				favouredStats:{'antimatter condenserCps':[1,1], 'antimatter condenserCost':[0.5, 0.6], 'wrathCookieFreq':[0.1, 0.2]},
				quote:'They couldn\'t care less about cookie baking.',
			},
			'enlightened':{
				name:'Enlightened',
				weight:0.05,
				sacLike:'Prism',
				favouredStats:{'prismCps':[1,1], 'prismCost':[0.5, 0.6], 'sugarLumpGrowth':[0.1, 0.2]},
			},
			'thrillSeeking':{
				name:'Thrill-Seeking',
				weight:0.05,
				sacLike:'Chancemaker',
				favouredStats:{'chancemakerCps':[1,1], 'chancemakerCost':[0.5, 0.6], 'shimmeringVeilDefense':[0.5, 0.8]},
			},
			'ruminative':{
				name:'Ruminative',
				weight:0.05,
				sacLike:'Fractal engine',
				favouredStats:{'fractal engineCps':[1,1], 'fractal engineCost':[0.5, 0.6], 'goldenCookieGain':[0.1, 0.2]},
			},
			'antisocial':{
				name:'Antisocial',
				weight:0.05,
				sacLike:'Javascript console',
				favouredStats:{'javascript consoleCps':[1,1], 'javascript consoleCost':[0.5, 0.6], 'wrathCookieGain':[0.1, 0.2]},
			},
			'commanding':{
				name:'Commanding',
				weight:0.05,
				sacLike:'Idleverse',
				favouredStats:{'idleverseCps':[1,1], 'idleverseCost':[0.5, 0.6], 'wrinklerSpawn':[0.1, 0.2]},
			},
			'thoughtful':{
				name:'Thoughtful',
				weight:0.05,
				sacLike:'Cortex baker',
				favouredStats:{'cortex bakerCps':[1,1], 'cortex bakerCost':[0.5, 0.6], 'goldenCookieDur':[0.1, 0.2]},
			},
			'egotistical':{
				name:'Egotistical',
				weight:0.05,
				sacLike:'You',
				favouredStats:{'youCps':[1,1], 'youCost':[0.5, 0.6], 'cps':[0.5, 0.8]},
			},
		};

		M.therapies = {
			'cryo':{
				id:'cryo',
				name:'Cyro Preservation',
				icon:[5,1],
				cpsCostPerTick:5,
				youRequirement:0,
				canBePickedUp:1,
				effStr:'<div class="gray">&bull; Freezes clone aging.</div>',
				passiveFunc:function(clone) { // Runs every tick
					clone.age = Math.max(clone.age - 1, M.ageBrackets[clone.ageBracket()]);
				},
				quote:'Reduces vat temperature to a point where life ceases to move.',
			},
			'growth':{
				id:'growth',
				name:'Growth Enhancment',
				icon:[0,1],
				cpsCostPerTick:20,
				youRequirement:50,
				canBePickedUp:1,
				effStr:'<div class="green">&bull; Increases chance of favoured genes.</div><div class="green">&bull; Increases upgrade power by 1%/tick.</div>',
				passiveFunc:function(clone) { // Runs every tick
					clone.upgradePower += 0.01

					for (var i in clone.stats) {
						var stat = clone.stats[i];
						if (M.isStatFavoured(clone, i)) {
							stat.weight += 0.05
						}
					};
				},
				quote:'A basic chemical mixture that encourages biological growth.'
			},
			'exposure':{
				id:'exposure',
				name:'Echo Exposure',
				icon:[1,1],
				cpsCostPerTick:30,
				youRequirement:100,
				canBePickedUp:1,
				effStr:'<div class="green">&bull; Increases upgrade rolls by 0.1/tick.</div><div class="red">&bull; Lowers upgrade power by 0.5%/tick.</div>',
				passiveFunc:function(clone) { // Runs every tick
					clone.upgradeRolls += 0.1;
					clone.upgradePower = Math.max(M.upgradePowerMin, clone.upgradePower - 0.005);
				},
				quote:'Soft sound waves are emitted throughout the vat, encouraging taking new opportunities when they arise.'
			},
			'infusion':{
				id:'infusion',
				name:'Sucrose Infusion',
				icon:[2,1],
				cpsCostPerTick:40,
				youRequirement:150,
				canBePickedUp:1,
				effStr:'<div class="green">&bull; Randomizes upgrade chances dramatically depending on time.</div><div class="green">&bull; Increases upgrade power by 1%/tick.</div><div class="red">&bull; Lowers upgrade rolls by 0.025/tick.</div>',
				passiveFunc:function(clone) { // Runs every tick
					clone.upgradePower += 0.01;
					clone.upgradeRolls = Math.max(M.upgradeRollsMin, clone.upgradeRolls - 0.025);

					for (var i in clone.stats) {
						var stat = clone.stats[i];
						Math.seedrandom(Game.seed+'/'+i+Math.floor(clone.therapyDurRemaining/10)); // Seed random based on stat id, changes every 10 ticks
						var statChaos = Math.random(); // Stat chaoticness is seeded
						Math.seedrandom();
						
						Math.seedrandom(Game.seed+'/'+i+statChaos);
						var isIncreasing = Math.random() < 0.5;
						Math.seedrandom();
						
						// Top 10% percentile goes bonkers
						if (statChaos >= 0.9) {
							statChaos *=2;
						};

						var increase = ((Math.pow(-1, isIncreasing?0:1) * (Math.pow(1.75, 1+statChaos) - 0.5))*2)/20 // *2 is for changing clone max age from 20 hours to 12, /20 is from changing to real time to ticks, 1 hour = 20 ticks at 3min ticks

						stat.weight = Math.max(M.statWeightMin, stat.weight + increase);
					};
				},
				quote:'Increases energy until anything seems within reach, although attention is often fickle.'
			},
			'rearrangement':{
				id:'rearrangement',
				name:'Nebulous Rearrangement',
				icon:[3,1],
				cpsCostPerTick:20,
				youRequirement:200,
				canBePickedUp:1,
				effStr:'<div class="gray">&bull; Equalizes upgrade chances.</div><div class="green">&bull; Increases upgrade rolls by 0.075/tick.</div>',
				passiveFunc:function(clone) { // Runs every tick
					clone.upgradeRolls = Math.max(M.upgradeRollsMin, clone.upgradeRolls + 0.075);

					for (var i in clone.stats) {
						var stat = clone.stats[i];
						var goal = 1;
						var increase = goal-stat.weight * 0.075;
						stat.weight = Math.max(M.statWeightMin, stat.weight + increase);
					};
				},
				quote:'Rearranges nueurons to allow for a mental reset and true discovery of oneself.'
			},
			'augmentation':{
				id:'augmentation',
				name:'Nucleatic Augmentation',
				icon:[4,1],
				cpsCostPerTick:40,
				youRequirement:250,
				canBePickedUp:1,
				effStr:'<div class="green">&bull; Singles out one gene and greatly increases its chance.</div><div class="green">&bull; Increases upgrade power by 3%/tick.</div><div class="red">&bull; Lowers upgrade rolls by 0.075/tick.</div>',
				passiveFunc:function(clone) { // Runs every tick
					clone.upgradePower += 0.03;
					clone.upgradeRolls = Math.max(M.upgradeRollsMin, clone.upgradeRolls - 0.075);

					var statList = [];
					for (var i in clone.stats) {
						statList.push(i);
					};

					Math.seedrandom(Game.seed+'/'+clone.ageBracket()); // Seed random based on age stage
					var seedValue = Math.floor(Math.random() * (statList.length));
					Math.seedrandom();
                    var randomStat = statList[seedValue];

					clone.stats[randomStat].weight += 0.2;
				},
				quote:'Searches and adjusts specific nucleotide sets to maximise their effect.',
			},
		};

		//

		M.secondsToTicks = function(seconds) {
			return seconds / M.tickDur;
		};

		M.ticksToSeconds = function(ticks) {
			return ticks * M.tickDur;
		};

		M.getDurStr = function(seconds, ticks) {
			return (seconds>0?Game.sayTime(seconds*Game.fps, -1):'0 seconds') +' ('+ ticks +' tick'+(ticks==1?'':'s')+')';
		};

		M.getDurStrFromTicks = function(ticks) {
			return M.getDurStr(M.ticksToSeconds(ticks), ticks)
		};

		M.getDurStrFromSeconds= function(seconds) {
			return M.getDurStr(seconds, M.secondsToTicks(seconds))
		};

		M.computeEffs=function()
		{
			M.toCompute=false;

			var effs={};
			for (var i in M.youStats) {
				M.calculateStatValues(M.youStats[i].potential, M.youStats[i].stats)
				for (var ii in M.youStats[i].stats) {
					var stat = M.youStats[i].stats[ii];
					if (effs[ii]) {
						effs[ii] += stat.power;
					} else { 
						effs[ii] = 1+stat.power;
					};
				};
			};

			M.effs=effs;
			Game.recalculateGains=1;
		};
		
		M.primeVatCooldown = 0;
		M.buildingPurchased = function() {
			var primeVat = M.vats['primeVat'];
			var rect=primeVat.l.getBounds();
			var primeClone = primeVat.holds;
			var youNumber = String(M.parent.amount);
			var stats = {};

			if (primeClone) {
				for (var i in primeClone.stats) {
					stats[i] = {};
					stats[i].upgradeHits = primeClone.stats[i].upgradeHits;
					stats[i].negative = primeClone.stats[i].negative;
					stats[i].power = 0;
				};

				if (M.primeVatCooldown==0) {
					Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
					PlaySound('snd/shimmerClick.mp3');
					M.primeVatCooldown ++;

					setTimeout(function() {
						M.primeVatCooldown --;
					},100);
				};
				
				M.calculateStatValues(primeClone.potential, stats)
				
				M.youStats[youNumber] = {};
				M.youStats[youNumber].stats = stats;
				M.youStats[youNumber].copiedCloneName = primeClone.name;
				M.youStats[youNumber].potential = primeClone.potential;
			};
			
			M.toCompute = true;			
		};

		M.buildingSold  = function() {
			var primeVat = M.vats['primeVat'];
			var rect=primeVat.l.getBounds();
			var youNumber = M.parent.amount+1;

			if (M.youStats[youNumber]) {
				delete(M.youStats[youNumber]);

				if (M.primeVatCooldown==0) {
					Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
					PlaySound('snd/spellFail.mp3', 0.35);
					M.primeVatCooldown ++;

					setTimeout(function() {
						M.primeVatCooldown --;
					},100);
				};
			};
			M.toCompute = true;
		};

		M.canAfford = function(cost)
		{
			if (Game.cookies>=cost) return true; else return false;
		};
		
		M.clone = function(name, where, personality, potential, age, upgradePower, upgradeRolls, stats, therapy, therapyDurRemaining, canBePickedUp, id, fromLoad)
		{	
			var vat = M.vats[where];
			if (!vat || vat.holds) {console.log('Attempted to make a clone in occupied '+ where); return}
			
			this.id = id || M.clonesN;
			this.name = name; //str
			this.personality = personality || 'fidgety'; //str
			this.age = age || 0; //num, in ticks
			this.potential = potential || 0.5; //num
			this.upgradePower = upgradePower || M.baseUpgradePower; //num, default of 1
			this.upgradeRolls = upgradeRolls || M.baseUpgradeRolls; //num, default of 5, round down when rolling
			this.stats = stats || {}; //eg: cps:{power:1, weight:0.125} -- this equal +1% cps, with an upgradeWeight of 0.125, stats at 0 power are hidden
			this.therapy = therapy!=undefined?therapy:0; //str or 0
			this.therapyDurRemaining = therapyDurRemaining!=undefined?therapyDurRemaining:-1; //num, in ticks
			this.location = where; //vatId
			this.canBePickedUp = canBePickedUp!=undefined?canBePickedUp:1;

			this.ageBracket = function() {
				var numGreater = -1;
				for (var i in M.ageBrackets) {
					if (this.age >= M.ageBrackets[i]) {
						numGreater++;
					};
				};
				return numGreater;
			};

			this.growUpFunc = function() {
				M.rollForStatUpgrades(this);
				l('cloneIcon-'+this.id).style.backgroundPosition = (-this.ageBracket()*48)+'px 0px';
			};

			var str = '';
			str+='<div id="clone-'+this.id+'" class="vatsCloneHolder">';
				str+='<div id="cloneIcon-'+this.id+'" class="shadowFilter vatsCloneIcon isClone" style="margin:12px 6px 0px 6px;background-position:'+(-this.ageBracket()*48)+'px 0px;"></div><div class="vatsCloneHolderDrag" id="vatsCloneDrag'+this.id+'"></div>';
			str+='</div>';
			M.vats[where].l.innerHTML = str;
			M.vats[where].holds = this;
			this.l = l('clone-'+this.id)

			AddEvent(l('vatsCloneDrag'+this.id),'mousedown',function(what){return function(e){if (e.button==0){M.dragWhat(what, "clone");}}}(this));
			//This doesn't appear to do anything? The document mouseup event is what makes it work AddEvent(l('vatsCloneDrag'+this.id),'mouseup',function(what){return function(e){if (e.button==0){M.dropClone(what);}}}(this));	

			M.clones[this.id] = this;
			if (!fromLoad) {
				M.clonesN++;
				M.creationNum++;
			};
			M.lastClone = this;
			return this;
		};

		M.destroyClone = function(clone) {
			M.vats[clone.location].holds = 0;
			clone.l.remove();
			delete(M.clones[clone.id]);
		};

		M.getCloneName = function(cloneName) {
			return cloneName.replaceAll('[C]', ',').replaceAll('$', Game.bakeryName);
		};

		M.getRandomCloneName = function() {
			var cloneTitle=Math.floor(Math.random()*3);
			var text=loc("Clone")+' #'+Math.floor(Math.random()*500+M.clonesN*500+1);
			if (EN)
			{
				text=[
					text,
					'$ '+romanize(M.clonesN+2)+(Math.random()<0.05?choose(['[C] Jr.','[C] Esq.','[C] Etc.',', Cont\'d','[C] and so forth']):''),
					choose([choose(['Lil\' $','Mini-$','$ '+(M.clonesN+2),'Attempt '+(M.clonesN+1),'Experiment '+(M.clonesN+1),'Not $','$, again','$, the sequel','$ '+(M.clonesN+2)+' Electric Boogaloo','Also $','$ (remixed)','The Other $','$, The Next Generation','$, part '+romanize(M.clonesN+2),'Revenge of $','The Return of $','$ reborn','$ in the flesh']),'$ "'+choose(['The Menace','The Artisan','The Relative','The Twin','The Specialist','The Officer','The Snitch','The Simpleton','The Genius','The Conformist','The Mistake','The Accident','Lab-grown','Vat Kid','Photocopy','Cloney','Ditto','Accounted For','Twitchy','Wacky','Zen','Rinse & Repeat','Spitting Image','Passing Resemblance','Nickname','Make It So','Deja-vu','Cookie','Clicky','Orteil','But Better','Guess Who','Transplant Fodder','Furthermore','One More Thing','Liquid','Second Chance','Offspring','Mulligan','Spare Parts'])+'" McClone']),
				][cloneTitle];
			};
			return text
		};

		M.getFavouredStats = function(clone) {
			return M.personalities[clone.personality].favouredStats;
		};

		M.isStatFavoured = function(clone, stat) {
			return M.getFavouredStats(clone)[stat];
		};

		M.calculateStatValues = function(potential, stats) {
			for (var i in stats) {
				stats[i].power = stats[i].upgradeHits * (M.isFavoured?M.favouredPowerMult:1) * ((stats[i].negative)?-1:1) * M.linearTransformTable(M.stats[i].upgradePower, potential);
				if (stats[i].power > 1) { // Cunk over stats that surpass 1% because that would be ludicrous
					stats[i].power = (stats[i].power-1)/10 + 1;
				};
			};
		};

		M.upgradeStat = function(clone, stat, hits, negative) {
			var statData = M.stats[stat];
			var isFavoured = M.isStatFavoured(clone, stat);
			if (hits==undefined) hits = 1;

			// If the stat is not present, set it to 0 instead
			if (stat && !clone.stats[stat]) {
				clone.stats[stat] = {};
				clone.stats[stat].negative = (negative!=undefined?negative:(!isFavoured && Math.random() < M.linearTransformTable(M.baseStatNegativeChance, clone.potential)));
				clone.stats[stat].weight = (isFavoured?M.favouredWeightMult:1)*(M.linearTransformTable(M.stats[stat].upgradeWeight, clone.potential));
				clone.stats[stat].power = 0;
				clone.stats[stat].upgradeHits = hits-1;
			} else if (stat) {
				clone.stats[stat].upgradeHits += clone.upgradePower * hits;
				clone.stats[stat].negative = negative==undefined?clone.stats[stat].negative:(clone.stats[stat].negative && negative)
			};
			M.calculateStatValues(clone.potential, clone.stats);
		};

		M.rollForBaseStats = function(clone)
		{	
			// Roll for favoured stats
			for (var i in M.getFavouredStats(clone)) {
				var statData = M.getFavouredStats(clone)[i];
				if (Math.random() < M.linearTransformTable(statData, clone.potential)) {
					M.upgradeStat(clone, i)
				};
			};

			// Roll for bonus base stats
			var bonusBaseStatChance = (1-clone.potential); // Lower potential = more bonus base stats, idea is potential is their potential in their personality
			for (var i = 0; (Math.random() <= bonusBaseStatChance || i<M.bonusBaseStatsMin) && i<=100; i++) {
				var randomStat = M.weightedRandom(M.stats);
				
				M.upgradeStat(clone, randomStat);
				
				if (i>=M.bonusBaseStatsMin) {
					
					bonusBaseStatChance *= M.bonusBaseStatMod;
				};
			};
		};

		M.rollForStatUpgrades = function(clone)
		{	
			var rollNum = Math.max(M.upgradeRollsMin, Math.floor(clone.upgradeRolls));

			for (var roll = 1; roll<=rollNum; roll++) {
				var randomStat = M.weightedRandom(clone.stats);
				var statData = M.stats[randomStat];
				
				M.upgradeStat(clone, randomStat);
			};
		};

		M.getCombineDestroyChance = function(ticks) {
			ticks = Math.max(ticks-1, 0);
			var modifier = (M.combinerDestroyChanceLevelMod + 1) - ((M.combinerDestroyChanceLevelMod*(M.parent.level-1))/M.parent.level);
			var offset = modifier/(M.combinerDestroyChanceMax-M.combinerDestroyChanceMin);
			return (modifier/(ticks+offset)) + M.combinerDestroyChanceMin;
		};

		M.combineClones = function(clone1, clone2, destroyChance) {	
			var newName = M.mangleSentences([clone1.name, clone2.name]);
			var newPersonality = choose([clone1.personality, clone2.personality]);
			var newPotential = M.linearTransformTable([clone1.potential, clone2.potential], Math.random());
			var combinedGenes = {};
			var totalGenes = 0;
			
			new M.clone(newName, 'combinerOutputVat', newPersonality, newPotential, M.ageBrackets[4]);

			for (var i in clone1.stats) {
				var stat = clone1.stats[i];
				totalGenes ++;
				combinedGenes[i] = stat
			};
			for (var i in clone2.stats) {
				var stat = clone2.stats[i];
				totalGenes ++;
				combinedGenes[i + '_2'] = stat;
			};

			for (var i in combinedGenes) {
				var chosenStat = i;
				var stat = combinedGenes[chosenStat];
				if (Math.random() >= destroyChance) {
					M.upgradeStat(M.lastClone, chosenStat.replace('_2', ''), stat.upgradeHits+1, stat.negative);
				};
			};

			M.destroyClone(clone1);
			M.destroyClone(clone2);

			M.calculateStatValues(M.lastClone.potential, M.lastClone.stats);

			var rect = M.vats['combinerOutputVat'].l.getBounds();
			Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
			PlaySound('snd/shimmerClick.mp3');
		};

		M.startCombiner = function(ticks) {
			var outputVat = M.vats['combinerOutputVat'];
			var clone1 = M.vats['combinerVat1'].holds;
			var clone2 = M.vats['combinerVat2'].holds;
			clone1.canBePickedUp = 0;
			clone2.canBePickedUp = 0;

			M.combinerTicksRemaining = ticks;
			M.combinerTotalTicks = ticks;

			var rect = outputVat.l.getBounds();
			Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
			PlaySound('snd/shimmerClick.mp3');
		};

		M.endCombiner = function(success) {
			var outputVat = M.vats['combinerOutputVat'];
			var destroyChance = M.getCombineDestroyChance(M.combinerTotalTicks);
			var clone1 = M.vats['combinerVat1'].holds;
			var clone2 = M.vats['combinerVat2'].holds;
			clone1.canBePickedUp = 1;
			clone2.canBePickedUp = 1;

			M.combinerTicksRemaining = 0;
			M.combinerTotalTicks = -1;

			if (success) {
				M.combineClones(clone1, clone2, destroyChance);
			} else {
				var rect = outputVat.l.getBounds();
				Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
				PlaySound('snd/spellFail.mp3', 0.5);
			};
		};

		M.sacButtonHovered=-1;
		M.hoverSacButton=function(what)
		{
			M.sacButtonHovered=what;
		};

		M.sacCapSelectionAndPool = function() {
			M.sacSelected = M.sacSelected<0?(M.buildingList.length-1):M.sacSelected%(M.buildingList.length);
			for (var i in M.sacPool) {
				M.sacPool[i] = Math.max(0, M.sacPool[i]);
				M.sacPool[i] = Math.min(Math.min(M.sacMax, Game.Objects[i].amount), M.sacPool[i]);
			};
		};

		M.getSacPower = function(building, pool) {
			if (!pool) pool = M.sacPool;
			var amountInPool = pool[building]?pool[building]:0;
			var buildingPower=  Game.Objects[building].id==19?0.5:(1+Game.Objects[building].id)/20; // You gives the same amount as an alchemy lab so that 1x of each building adds up to 1 sac power, also idk some vague balancing thing of You having the strongest personality so increasing the weight of that personality shouldn't give the most sac power

			return Math.round(amountInPool * buildingPower * 100)/1000;
		};

		M.getTotalSacPower = function(pool) {
			if (!pool) pool = M.sacPool;
			var totalSacPower = 0;
			for (var i in M.buildingList) {
				totalSacPower += M.getSacPower(M.buildingList[i], pool);
			};
			return Math.round(totalSacPower*1000)/1000;
		};

		M.getSynthesizeMinPotential = function(ticks, sacrificePower) {
			ticks = Math.max(ticks-1, 0);
			var effectiveLevel = M.parent.level + (sacrificePower*M.synthesizerMinPotentialSacrificePowerLevelEquivalent);
			var modifier = (M.synthesizerMinPotentialLevelMod + 1) - ((M.synthesizerMinPotentialLevelMod*(effectiveLevel-1))/effectiveLevel);
			var offset = modifier/(M.synthesizerMinPotentialMax-M.synthesizerMinPotentialMin);
			return (modifier/(-ticks-offset)) + M.synthesizerMinPotentialMax;
		};

		M.startSynthesis = function(ticks) {
			var synthesizerVat = M.vats['synthesizerVat'];
			M.sacCapSelectionAndPool();

			M.synthesizerTicksRemaining = ticks;
			M.synthesizerDuration = ticks;
			M.synthesizerSacPool = M.sacPool;

			var rect=synthesizerVat.l.getBounds();
			Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
			PlaySound('snd/shimmerClick.mp3');

			for (var building in M.sacPool) {
				var amount = M.sacPool[building];
				if (amount>0) {
					Game.Objects[building].sacrifice(M.sacPool[building]);
				};
			};
			M.sacPool = {};
		};

		M.endSynthesis = function(success) {
			var synthesizerVat = M.vats['synthesizerVat'];

			if (success) {
				var minPotential = M.getSynthesizeMinPotential(M.synthesizerDuration, M.getTotalSacPower(M.synthesizerSacPool));
				var newClone = new M.clone(M.getRandomCloneName(), 'synthesizerVat');
				var potentialMod = 2;
				var potential = Math.pow(Math.random()*Math.pow(1-minPotential,1/potentialMod), potentialMod) + minPotential;
				var personalityList = {};

				for (var personality in M.personalities) {
					var personalityData = M.personalities[personality];
					var sacLike = personalityData.sacLike?personalityData.sacLike:0;
					var sacNum = M.synthesizerSacPool[sacLike]?M.synthesizerSacPool[sacLike]:0
					var buildingFavour = M.linearTransformNumber(1, M.sacLikeWeightMult, (sacNum/M.sacMax));
					personalityList[personality] = {};
					personalityList[personality].weight = personalityData.weight * buildingFavour;
				}
				
				newClone.personality = M.weightedRandom(personalityList);
				newClone.potential = potential;
				M.rollForBaseStats(newClone);

				PlaySound('snd/shimmerClick.mp3');
			} else {
				PlaySound('snd/spellFail.mp3', 0.5);
			};
			var rect = synthesizerVat.l.getBounds();
			Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);

			M.synthesizerTicksRemaining = 0;
			M.synthesizerSacPool = {};
			M.synthesizerDuration = -1;
		};

		M.getMaxTherapyTime = function(clone) {
			return (clone.age==M.ageBrackets[4]?20*24:M.ageBrackets[4]-clone.age)
		};

		M.giveTherapy = function(clone, therapyId, duration)
		{	
			var rect=clone.l.getBounds();
			Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
			PlaySound('snd/spell.mp3', 0.5);

			clone.canBePickedUp = 0;
			clone.therapy = therapyId;
			clone.therapyDurRemaining = Number(duration); // Give duration in ticks
		};

		M.removeTherapy = function(clone)
		{	
			var rect=clone.l.getBounds();
			Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
			PlaySound('snd/spellFail.mp3', 0.5);

			clone.canBePickedUp = 1;
			clone.therapy = 0;
			clone.therapyDurRemaining = -1;
		};

		M.showBinConfirmPrompt = function(clone) {
			Game.Prompt('<noClose><id vatsBinConfirm><h3>Destroy clone?</h3><div class="block">'+tinyIcon([4,2,MMMImagePrefix+'/vatsClones.png'])+
				'<div class="line"></div>'+
				'<div id="vatsBinConfirmContainer">'+
					'Are you <b>SURE</b> you want to <span class="red"><b>destroy</b></span> this clone?'+
					M.getCloneTooltipBox(clone)+
					'<span style="margin:4px;" class="red"><b>This cannot be undone.</b></span>'+
				'</div></div>',
				[['Destroy clone',0,'float:left'],['Cancel',0,'float:right']], 0, 'widePrompt') // widePrompt is apparently a thing, so yay!

			l('promptOption0').addEventListener('click',function(){
				M.destroyClone(clone);
				M.binTicksRemaining = M.binTickCooldown;
				M.bin.canBePickedUp = 0;

				l('vatsBinIcon').style.backgroundPosition = (-3*48)+'px '+(-2*48)+'px';

				var rect=l('vatsBinHolder').getBounds();
				Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24+32-TopBarOffset);
				PlaySound('snd/giftsend.mp3',0.75);
			});

			Game.UpdatePrompt(); // Fixes a bug with the prompt stuttering in position when loaded

			PlaySound('snd/toneTick.mp3');
		};

		M.increaseTimerPrompt = function(amount) {
			l('vatsTicksInput').value = Number(l('vatsTicksInput').value) + Number(amount);
			PlaySound('snd/tick.mp3');
			Game.UpdatePrompt();
		};

		M.showTicksPrompt = function(name, maxFunc, icon, cpsCostPerTick, successFunc, extraDiv, updateFunc) {
			var adjustsMinor = [['+1 tick', 1], ['-1 tick', -1, '<br>']];
			var adjustsMajor = [['+20 ticks', 20], ['-20 ticks', -20]];

			name = '<b>'+ name +'</b>';

			Game.Prompt('<noClose><id vatsTicksPrompt><h3>Set Duration</h3><div class="block">'+tinyIcon([icon[0],icon[1],MMMImagePrefix+'/vatsClones.png'])+'<div class="line"></div>'+
				'<div id="vatsTicksPromptContainer"></div></div>',
				[['Submit',0,'float:left'],['Cancel',0,'float:right']],
				function() {
					var value = Math.max(0, Math.round(Math.min(maxFunc(), l('vatsTicksInput')?l('vatsTicksInput').value:0)));
					var cost = Game.cookiesPs * value * cpsCostPerTick;

					if (l('vatsTicksInput')) {
						l('vatsTicksInput').value = value;
					};

					if (l('vatsTicksDurationVisual')) {
						l('vatsTicksDurationVisual').innerHTML = 'Duration: '+ M.getDurStrFromTicks(value) + '.';
					};

					if (l('vatsTicksPromptCostBreakdown')) {
						l('vatsTicksPromptCostBreakdown').innerHTML = M.getDurStrFromTicks(value) +' of '+ name +' costs:<br>'+
						'<span class="price '+ (M.canAfford(cost)?'':'disabled') +'">'+Beautify(Math.round(shortenNumber(cost)))+'</span><br>'+
						'<small>'+loc("%1 of CpS",[((value+1)>0)?Game.sayTime((cost/Game.cookiesPs) * Game.fps,-1):'0 seconds'])+'</small>'
					};

					if (l('promptOption0')) {
						if ((Game.cookies < cost || cost == 0) && !l('promptOption0').classList.contains('disabled')) {
							l('promptOption0').classList.add('disabled');
							triggerAnim(l('promptOption0'),'pucker');
						};
						if ((Game.cookies >= cost && cost > 0) && l('promptOption0').classList.contains('disabled')) {
							l('promptOption0').classList.remove('disabled');
							triggerAnim(l('promptOption0'),'pucker');
						};
					};

					if (updateFunc) {
						updateFunc(value);
					};
				}
			);
			var str = 'Set duration for '+ name +'<br>'+
				'<div id="vatsTicksDurationVisual"style="display:inline-block;font-size:10px;"></div>'+
				'<input type="number" style="margin-top:4px;text-align:center;width:100%;font-weight:bold;" id="vatsTicksInput" value="'+ (0) +'"/></div>'+
				'<div style="display:inline-block;width:100%">'
					for (var i in adjustsMinor) {
						var v = adjustsMinor[i];
						str+='<a id="vatsTicksPromptIncreaseMinor'+ i +'" style="float:'+ (i%2?'right':'left') +';" class="option" '+Game.clickStr+'="Game.ObjectsById['+M.parent.id+'].minigame.increaseTimerPrompt('+ v[1] +')">'+ v[0] +'</a>';
						str+=(v[2]?v[2]:'');
					};
				str += '</div>'+
				'<div style="display:inline-block;width:100%">'
					for (var i in adjustsMajor) {
						var v = adjustsMajor[i];
						str+='<a id="vatsTicksPromptIncreaseMajor'+ i +'" style="float:'+ (i%2?'right':'left') +';" class="option" '+Game.clickStr+'="Game.ObjectsById['+M.parent.id+'].minigame.increaseTimerPrompt('+ v[1] +')">'+ v[0] +'</a>';
						str+=(v[2]?v[2]:'');
					};
				str += '</div>'+
				'<div class="line"></div>'+
				'<div id="vatsTicksPromptCostBreakdown" style="line-height:125%;"></div>'
				
			if (extraDiv) {
				str+='<div class="line"></div>';
				str+=extraDiv;
			};

			l('vatsTicksPromptContainer').innerHTML = str;

			l('promptOption0').addEventListener('click',function(){
				var value = Math.max(0, Math.round(Math.min(maxFunc(), l('vatsTicksInput')?l('vatsTicksInput').value:0)));
				successFunc(value);
				Game.ClosePrompt();
			});

			l('vatsTicksInput').focus();
			l('vatsTicksInput').select();

			Game.UpdatePrompt(); // Fixes a bug with the prompt stuttering in position when loaded

			PlaySound('snd/toneTick.mp3');
		};

		M.getCloneTooltipBox = function(clone) {
			var vat = M.vats[clone.location];
			var ageStage = clone.ageBracket();
			var ageAlpha = clone.age / M.ageBrackets[4];
			var activity = (vat.activeDescFunc(clone))?vat.activeDescFunc(clone):'This clone doesn\'t appear to be doing anything.';
			
			// Icon + Name + activity
			var str = '<div class="block" style="text-align:left;">'+
				'<div class="icon" style="background:url('+MMMImagePrefix+'/vatsClones.png);float:left;margin-left:-8px;margin-top:-8px;background-position:'+(-ageStage*48)+'px 0px;"></div>'+
				'<div class="name">'+M.getCloneName(clone.name)+'</div><div><small>'+ activity +'</small></div>'+
				'<div class="line"></div>'+
				// Aging report
				'<div style="text-align:center;">'+
					'<div style="display:inline-block;position:relative;box-shadow:0px 0px 0px 1px #000,0px 0px 0px 1px rgba(255,255,255,0.5) inset,0px -2px 2px 0px rgba(255,255,255,0.5) inset;width:256px;height:6px;background:linear-gradient(to right,#ffffff 0%,#f200a1 '+(100*M.ageBrackets[1]/M.ageBrackets[4])+'%,#FFFFFF '+(0.1+(100*M.ageBrackets[1]/M.ageBrackets[4]))+'%,#2300ef '+(100*M.ageBrackets[2]/M.ageBrackets[4])+'%,#FFFFFF '+(0.1+(100*M.ageBrackets[2]/M.ageBrackets[4]))+'%, #00efe3 '+(100*M.ageBrackets[3]/M.ageBrackets[4])+'%,#FFFFFF '+(0.1+(100*M.ageBrackets[3]/M.ageBrackets[4]))+'%, #5af230 100%)">'+
						'<div class="vatsCloneGrowthIndicator" style="left:'+Math.floor((ageAlpha)*256)+'px;"></div>'+
						'<div style="background:url('+MMMImagePrefix+'/vatsClones.png);background-position:0px 0px;position:absolute;left:'+(0-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
						'<div style="background:url('+MMMImagePrefix+'/vatsClones.png);background-position:'+(-1*48)+'px 0px;position:absolute;left:'+(((M.ageBrackets[1]/M.ageBrackets[4])*256)-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
						'<div style="background:url('+MMMImagePrefix+'/vatsClones.png);background-position:'+(-2*48)+'px 0px;position:absolute;left:'+(((M.ageBrackets[2]/M.ageBrackets[4])*256)-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
						'<div style="background:url('+MMMImagePrefix+'/vatsClones.png);background-position:'+(-3*48)+'px 0px;position:absolute;left:'+(((M.ageBrackets[3]/M.ageBrackets[4])*256)-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
						'<div style="background:url('+MMMImagePrefix+'/vatsClones.png);background-position:'+(-4*48)+'px 0px;position:absolute;left:'+(256-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
					'</div><br>'+
					'<b>'+loc("Age: ")+'</b> '+ M.ageNames[ageStage] +'<br>'+
					'<small>'+((clone.therapy == 'cryo')?('Clone aging frozen<br>'):(ageStage == 4)?('This clone has fully grown!<br>'):('Next stage in: '+ M.getDurStrFromTicks(M.ageBrackets[ageStage+1]-clone.age) +'.<br>Fully grown in: '+ M.getDurStrFromTicks(M.ageBrackets[4]-clone.age) +'.<br>'))+'</small>'+
				'</div>'+
				'<div class="line"></div>'
				// Therapy
				if (clone.therapy && clone.therapyDurRemaining > 0) {
					str+='<div class="description">'+
						'<div class="vatsTherapyEffect">'+
							'<div class="icon" style="background:url('+MMMImagePrefix+'/vatsClones.png);float:left;margin-left:-8px;margin-top:-8px;background-position:'+(-48*M.therapies[clone.therapy].icon[0])+'px '+-48*M.therapies[clone.therapy].icon[1]+'px;"></div>'+
							'<div class="name">'+ M.therapies[clone.therapy].name +'</div>'+
							'<div class="line"></div>'+
							'<div style="text-align:left;">'+
								'<div style="margin:6px 0px;"><b>'+loc("Effects:")+'</b></div>'+
								'<div style="font-size:11px;font-weight:bold;">'+M.therapies[clone.therapy].effStr+'</div>'+
							'</div>'+
							//(M.therapies[clone.therapy].quote?('<q>'+M.therapies[clone.therapy].quote+'</q>'):'')+
						'</div>'+
						'<div class="vatsTherapyEffect"><b>Time Remaining:</b> '+ M.getDurStrFromTicks(clone.therapyDurRemaining) +'.</div>'+
					'</div>'+
					'<div class="line"></div>'
				};
				// Attributes
				str+='<div class="description">'+
					'<div style="margin:6px 0px;font-size:11px;"><b>Personality:</b> '+ M.personalities[clone.personality].name +'</div>'+
					'<div style="margin:6px 0px;font-size:11px;"><b>Potential:</b> '+ Math.round(clone.potential*100) +'%</div>'+
					'<div style="margin:6px 0px;font-size:11px;"><b>Upgrade Rolls:</b> '+ Math.floor(clone.upgradeRolls) +'</div>'+
					'<div style="margin:6px 0px;font-size:11px;"><b>Upgrade Power:</b> '+ Math.round(clone.upgradePower*100) +'%</div>'+
				'</div>'+
				'<div class="line"></div>'+
				// Effects
				'<div class="description">'+
					'<div style="margin:6px 0px;"><b>'+loc("Genes:")+'</b> <span style="font-size:11px;">(while in the prime vat, purchasing a You will give it all these effects. Bar represents chance to be upgraded.)</span></div>';
					var totalWeight = M.getTotalWeight(clone.stats);
					var geneStr = ''
					for (var i in clone.stats) {
						var stat = clone.stats[i];
						var isFavoured = M.isStatFavoured(clone, i);
						geneStr+='<div style="height:15px">'+
							'<div style="z-index:1;position:relative;font-size:11px;font-weight:bold;" class="'+ ((stat.power==0)?'gray':((stat.negative)?'red':'green')) +'">'+(isFavoured?'★':'&bull;')+' '+ ((stat.power==0)?'???':M.stats[i].statStr) +' '+ ((stat.power>0)?'+':'') + ((stat.power==0)?'?':(Math.abs(stat.power)>0.01)?(Math.round(stat.power*10000)/100):(stat.power*100).toPrecision(1)) +'%</div>'+
							'<div style="position:relative;width:'+100*(stat.weight/totalWeight)+'%;top:-13px;height:13px;background:linear-gradient(to right, #00000000 0%, #33e0ff33 33%, #33e0ff88 100%)"></div>'+
						'</div>';
					};
					str+=(geneStr!=''?geneStr:'<div style="font-size:10px;margin-left:64px;"><b>'+loc("None.")+'</b></div>')+
					//str+=(M.personalities[clone.personality].quote?('<q>'+M.personalities[clone.personality].quote+'</q>'):'')+
				'</div>'+
			'</div>';
			return str;
		};

		M.vatTooltip=function(id)
		{
			return function(){
				var vat = 0;
				var dragging = M.dragging;

				for (var i in M.vats) {
					if (M.vats[i].N == id) {
						vat = M.vats[i];
					};
				};

				if (!vat) {console.log("VAT ERROR WITH ID "+ id); return};

				var clone = vat.holds;
				var str='<div style="padding:8px 4px;min-width:350px;">';
					str+='<div class="name" style="text-align:center;">'+vat.name+'</div><div class="line"></div>'
				
				if (clone && (M.draggingType != 'therapy' && M.draggingType !='bin')) {
					str+=M.getCloneTooltipBox(clone);
				} else {
					if (dragging && M.draggingType == 'therapy') {
						var notStorage = vat.id.search("storageVat")==-1;
						var cantDrop = notStorage || (!clone && !notStorage)
						str+='<div class="block description '+ ((cantDrop)?('red'):'') +'">';
						if (clone && !notStorage) {
							str+='Release to enact <b>'+ dragging.name +'</b> on <b>'+ M.getCloneName(clone.name) +'</b>.';
						} else if (notStorage) {
							str+='Only clones in storage can undergo therapy.'
						} else {
							str+='There is no clone here.'
						}
						str+='</div>';
					} else if (dragging && M.draggingType == 'bin') {
						var isAge = clone?clone.ageBracket()==4:0;
						var isBusy = clone?clone.canBePickedUp==0:0;
						var cantDrop = !clone || !isAge || isBusy;
						str+='<div class="block description '+ ((cantDrop)?('red'):'') +'">';
						if (clone && isAge && !isBusy) {
							str+='Release to <span class="red"><b>destroy</b></span> <b>'+ M.getCloneName(clone.name) +'</b>.';
						} else if (clone && !isAge) {
							str+='Only <b>adult</b> clones can be put in the bin.'
						} else if (clone && isBusy) {
							str+='<b>Busy</b> clones can\'t be put in the bin.';
						} else {
							str+='There is no clone here.'
						}
						str+='</div>';
					} else {
						var cantDrop = vat.dropRule == -1 || (dragging && dragging.ageBracket() < vat.dropRule);
						str+='<div class="block description '+ ((cantDrop)?('red'):'') +'">';
						if (!cantDrop && dragging) {
							str+='Release to place <b>'+ M.getCloneName(dragging.name) + '</b> in this vat.';
						} else if (vat.dropRule > -1) {
							str+='Drag a'+ ((vat.dropRule==4)?'n <b>adult</b>':'') +' clone onto this vat to place it here.'
						} else if (vat.dropRule == -1) {
							str+='You cannot place a clone here.'
						}
						str+='</div>';
					};
				}

				if (vat.vatInfoFunc && vat.vatInfoFunc()) {
					str+='<div class="description" style="text-align:center;font-size:11px;line-height:100%;">';
						str+=vat.vatInfoFunc();
					str+='</div>';
				};

				str+='</div>'

				return str;
			};
		};

		M.infoTooltip = function(id) {
			return function() {
				var building = Game.Objects[minigameBuildingName];
				var effStr = '';
				var effList = {};
				var setsNum = 0;
				
				// This is all hacky nonsense
				
				// i = you num, v = {'cps':0.01, 'click':0.01, etc}
				for (var i = 1; i <= building.amount; i++) {
					var stats = M.youStats[i]?M.youStats[i].stats:{};

					// Clean up ineffective stats
					for (var ii in stats) {
						if (stats[ii].upgradeHits == 0) {
							delete(stats[ii]);
						};
					};

					var stringifiedStats = JSON.stringify(stats) // Lmaoooo
					var v = effList[stringifiedStats + (setsNum - 1)] 
					if (v) {
						v.lowestYou = (v.lowestYou > i)?i:v.lowestYou;
						v.highestYou = (v.highestYou < i)?i:v.highestYou;
					} else {
						effList[stringifiedStats + setsNum] = {};
						effList[stringifiedStats + setsNum].stats = stats
						effList[stringifiedStats + setsNum].lowestYou = i;
						effList[stringifiedStats + setsNum].highestYou = i;
						setsNum++;
					}
				};
				
				effStr+='<div>'
				// Individual sets
				var totalEff = [];
				for (var i in effList)
				{	
					var v = effList[i];
					var mult = 1+(v.highestYou-v.lowestYou)
					var copiedCloneName = M.youStats[v.lowestYou]?M.getCloneName(M.youStats[v.lowestYou].copiedCloneName):0;
					
					effStr+='<div style="font-size:11px;margin-left:48px;">'+ v.lowestYou + ((v.lowestYou!=v.highestYou)?'-'+ v.highestYou:'') +' ('+ mult +')'+ ((copiedCloneName != 0)?' <small>(Copying genes from <b>'+ copiedCloneName +'</b>)</small>':'') +':</div>'
					
					var otherEffectStr = ''
					for (var statId in v.stats) {
						var power = v.stats[statId].power * mult;
						totalEff[statId] = totalEff[statId]?totalEff[statId]+power:power;
						var negative = v.stats[statId].negative;
						otherEffectStr+='<div style="font-size:10px;margin-left:64px;" class="'+ ((power==0)?'gray':((negative)?'red':'green')) +'">&bull; '+ ((power==0)?'???':M.stats[statId].statStr) +' '+ ((power>0)?'+':'') + ((power==0)?'?':(Math.abs(power)>0.01)?(Math.round(power*10000)/100):(power*100).toPrecision(1)) +'%</div>'			
					};
					if (otherEffectStr == '') {otherEffectStr='<div style="font-size:10px;margin-left:64px;"><b>None.</b></div>';}
					effStr+=otherEffectStr;
				};

				// Total
				effStr+='<div class="line"></div>';
				effStr+='<div style="margin-left:40px">Combined effects of all You:</div>';
				var otherEffectStr = ''
				for (var i in totalEff)
				{	
					var power = totalEff[i];
					var negative = Math.sign(power)!=Math.sign(M.stats[i].upgradePower[0]);
					otherEffectStr+='<div style="font-size:10px;margin-left:64px;" class="'+ ((power==0)?'gray':((negative)?'red':'green')) +'">&bull; '+ ((power==0)?'???':M.stats[i].statStr) +' '+ ((power>0)?'+':'') + ((power==0)?'?':(Math.abs(power)>0.01)?(Math.round(power*10000)/100):(power*100).toPrecision(1)) +'%</div>'						
				};
				if (otherEffectStr == '') {otherEffectStr='<div style="font-size:10px;margin-left:64px;"><b>None.</b></div>';}
				effStr+=otherEffectStr;
				effStr+='</div>';

				if (effStr=='') effStr='<div style="font-size:10px;margin-left:64px;"><b>None.</b></div>';
				effStr+='<div class="line"></div>';
				effStr+='<div style="float:right;margin:0px 0px 8px 8px;"/><small style="line-height:100%;">'+
				'&bull; New clones will gain genes based on their personality and potential.<br>'+
				//'&bull; Low potential clones may also gain bonus genes, these genes may not be favoured.<br>'+
				'&bull; When a clone rolls for upgrades, for each upgrade roll a clone has, a random gene will be chosen, that gene will then be upgraded by its upgrade value multiplied by the clone\'s upgrade power.<br>'+
				'&bull; Personalities may have favoured genes which have a higher upgrade value and upgrade chance.<br>'+
				'&bull; High potential clones will generally have better genes than low potential clones.<br>'+
				//'&bull; Clones do not reset when you ascend.<br>'+
				//'&bull; Incubator Vats time does not progress while the game is closed.<br>'+
				'</small>';
				
				var str='<div style="padding:8px 4px;min-width:350px;" id="tooltipVatsInfo">'+
					'<div class="icon" style="background:url('+MMMImagePrefix+'/vatsClones.png);float:left;margin-left:-8px;margin-top:-8px;background-position:'+(-1*48)+'px '+(-2*48)+'px;"></div>'+
					'<div><div class="name">Incubator Vats Info</div></div>'+
					'<div class="line"></div>'+
					'<div class="description">'+
						'<div>Effects of You:</div>'+
						effStr+
					'</div>'+
				'</div>';
				return str;
			}
		};

		M.binTooltip = function(id) {
			return function() {
				var str='<div style="padding:8px 4px;min-width:350px;" id="tooltipVatsInfo">'+
					'<div class="icon" style="background:url('+MMMImagePrefix+'/vatsClones.png);float:left;margin-left:-8px;margin-top:-8px;background-position:'+(-3*48)+'px '+(-2*48)+'px;"></div>'+
					'<div><div class="name">Destroy Clone</div></div>'+
					'<div class="line"></div>'+
					'<div class="description">'+
						'<div style="text-align:left;">'+
							'<div style="margin:6px 0px;">'+(M.binTicksRemaining>0?'<b>Bin Cooldown:</b> '+M.getDurStrFromTicks(M.binTicksRemaining)+'.':'Drag this on to an <b>adult</b> clone who isn\'t <b>busy</b> with something to <span class="red"><b>destroy</b></span> it.')+'</div>'+
						'</div>'+
						'<q>Of course they\'re not <i>REALLY</i> destroyed; they\'re sent to a clone farm upstate where they get to farm cookies for the rest of their days. It just so happens that the way there passes through the trash chute.</q>'+
					'</div>'+
				'</div>';
				return str;
			}
		};

		M.therapyTooltip = function(id) {
			return function() {
				var therapy = M.therapies[id];
				var cost = Game.cookiesPs * therapy.cpsCostPerTick;
				
				var str='<div style="padding:8px 4px;min-width:350px;" id="tooltipVatsTherapy">';
						if (M.parent.amount < therapy.youRequirement) {
							str+='<div style="text-align:center;">Therapy unlocked at '+therapy.youRequirement+' <b>You</b>.</div>';
						} else {
							str+='<div class="icon" style="background:url('+MMMImagePrefix+'/vatsClones.png);float:left;margin-left:-8px;margin-top:-8px;background-position:'+(-therapy.icon[0]*48)+'px '+(-therapy.icon[1]*48)+'px;"></div>'+
							'<div style="float:right;text-align:right;width:150px;"><small>'+ M.getDurStrFromTicks(1) +' of therapy costs:</small><br><span class="price '+ (M.canAfford(cost)?'':'disabled') +'">'+Beautify(Math.round(shortenNumber(cost)))+'</span><br><small>'+loc("%1 of CpS",[Game.sayTime((cost/Game.cookiesPs)*Game.fps,-1)])+'</small></div>'+
							'<div style:"width:200px;"><div class="name">'+ therapy.name +'</div><small>Drag this therapy onto a clone in storage to enact the therapy.</small></div>'+
							'<div class="line"></div>'+
							'<div class="description">'+
								'<div style="text-align:left;">'+
									'<div style="margin:6px 0px;"><b>'+loc("Effects:")+'</b></div>'+
									'<div style="font-size:11px;font-weight:bold;">'+therapy.effStr+'</div>'+
								'</div>'+
							(therapy.quote?('<q>'+therapy.quote+'</q>'):'')+
							'</div>';
						};
					str+='</div>';
				return str;
			};
		};

		M.sacTooltip = function(id) {
			return function() {
				var selected = M.buildingList[M.sacSelected];
				var name = M.sacAddAmount==1?Game.Objects[selected].single:Game.Objects[selected].plural;
				var plural = Game.Objects[selected].plural;
				var hoveredStr = (M.sacButtonHovered!=-1 && M.sacButtonsInfo[M.sacButtonHovered.id])?M.sacButtonsInfo[M.sacButtonHovered.id](M.sacAddAmount, name, plural, tinyIcon([Game.Objects[selected].iconColumn, 0])):undefined;
				var sacStr = '';
				
				for (var i in M.buildingList) {
					var building = M.buildingList[i];
					var amount = M.sacPool[building];
					var buildingData = Game.Objects[building];
					if (amount > 0) {
						sacStr+='<br><b>'+amount+'x '+ tinyIcon([buildingData.iconColumn, 0]) +' '+ (amount==1?buildingData.single:buildingData.plural)+ '</b> giving <b>+'+M.getSacPower(building)+'</b> sacrifice power.';
					};
				};
				sacStr = (sacStr==''?'<br><b>None.</b>':sacStr +'<div class="line"></div>For a total sacrifice power of:<br><b>'+M.getTotalSacPower()+'</b>')

				var str='<div style="padding:8px;width:300px;font-size:11px;text-align:center;">'+
					'You can sacrifice up to 500 buildings of each type to influence a synthesized clone\'s potential and personality.'+
					'<div class="line"></div>';
					if (hoveredStr) {
						str+=hoveredStr;
						str+='<div class="line"></div>';	
					}
					str+='Your sacrifice:'+
					sacStr+
				'</div>';
				return str;
			}
		};

		M.dragging=false;
		M.draggingType = 0;
		M.dragWhat = function(what, type)
		{
			//var clone = M.vats[vat].holds;
			if (!what.canBePickedUp) {return};
			
			M.dragging = what;
			M.draggingType = type;
			
			var div=what.l;
			var box=div.getBounds();
			var box2=l('vatsDrag').getBounds();
			
			div.className='vatsCloneHolder vatsDragged';
			
			l('vatsDrag').appendChild(div);
			if (M.draggingType == 'therapy') {
				l('vatsTherapyPlaceholder'+(M.dragging.id)).style.display = 'inline-block';
			};
			
			var x=box.left-box2.left;
			var y=box.top-box2.top;

			div.style.transform='translate('+(x)+'px,'+(y)+'px)';
			PlaySound('snd/tick.mp3');
		};

		M.dropWhat = function()
		{
			var dragging = M.dragging;
			if (!dragging) return;

			var div = dragging.l;
			var type = M.draggingType;

			div.className='vatsCloneHolder';
			if (M.draggingType == 'therapy') { // Hack!!!!!
				div.className = 'vatsTherapy vatsCloneHolder';
			};
			div.style.transform='none';

			if (type == 'clone') {
				if (M.vatHovered != -1 && (dragging.location == M.vatHovered)) //dropping on vat but vat is the same as the original
				{
					M.vats[M.vatHovered].l.appendChild(div);
					PlaySound('snd/sell1.mp3',0.75);
				}
				else if (M.vatHovered !=-1 && M.vats[M.vatHovered].holds == 0 && M.vats[M.vatHovered].dropRule != -1 && M.dragging.ageBracket() >= M.vats[M.vatHovered].dropRule )//dropping on a vat which is empty
				{	
					l('vat-'+M.vatHovered).appendChild(div);
					M.vats[dragging.location].holds = 0;
					dragging.location = M.vatHovered;
					M.vats[M.vatHovered].holds = dragging;
					
					PlaySound('snd/tick.mp3');
				}
				else // let go above air
				{
					l('vat-'+dragging.location).appendChild(div);
					PlaySound('snd/sell1.mp3',0.75);
				}
			} else if (type == 'therapy') { // Dragging a therapy
				if (M.vatHovered != -1 && M.vats[M.vatHovered].holds != 0 && M.vats[M.vatHovered].id.search("storageVat")!=-1) {
					var vatHovered = M.vatHovered;
					var clone = M.vats[vatHovered].holds;
					
					M.showTicksPrompt(dragging.name, function(){return M.getMaxTherapyTime(clone)}, dragging.icon, dragging.cpsCostPerTick, function(value) {
						var cost = Game.cookiesPs * value * dragging.cpsCostPerTick
						if (Game.cookies>=cost) {
							Game.Spend(cost);
							M.giveTherapy(clone, dragging.id, value);
						};
					})
					
					l('vatsTherapyPlaceholder'+(M.dragging.id)).parentNode.insertBefore(div, l('vatsTherapyPlaceholder'+(M.dragging.id)));
					l('vatsTherapyPlaceholder'+(M.dragging.id)).style.display = 'none';

					// Mother of all hackiness, fixes the vat staying hovered when the prompt appears
					l('vat-'+ vatHovered).classList.remove('on');
					setTimeout(function() {
						l('vat-'+ vatHovered).classList.add('on');
					}, 100);
				} else {
					l('vatsTherapyPlaceholder'+(M.dragging.id)).parentNode.insertBefore(div, l('vatsTherapyPlaceholder'+(M.dragging.id)));
					l('vatsTherapyPlaceholder'+(M.dragging.id)).style.display = 'none';
					PlaySound('snd/sell1.mp3',0.75);
				}
			} else if (type == 'bin') {
				if (M.vatHovered != -1 && M.vats[M.vatHovered].holds != 0 && M.vats[M.vatHovered].holds.ageBracket()==4 && M.vats[M.vatHovered].holds.canBePickedUp == 1) {
					var vatHovered = M.vatHovered;
					var clone = M.vats[vatHovered].holds;
					
					l('vatsBinHolder').appendChild(div);

					M.showBinConfirmPrompt(clone);

					l('vat-'+ vatHovered).classList.remove('on');
					setTimeout(function() {
						l('vat-'+ vatHovered).classList.add('on');
					}, 100);
				} else {
					l('vatsBinHolder').appendChild(div);
					PlaySound('snd/sell1.mp3',0.75);
				}
			};
			M.dragging=false;
			M.draggingType=0;
		};
		
		M.vatHovered=-1;
		M.hoverVat=function(what)
		{
			M.vatHovered=what;
			if (M.dragging)
			{
				PlaySound('snd/clickb'+Math.floor(Math.random()*7+1)+'.mp3',0.75);
			}
		};

		M.makeVat = function(id, name, activeDescFunc, dropRule, vatInfoFunc) {
			M.vats[id] = {};
			M.vats[id].name = name;
			M.vats[id].activeDescFunc = activeDescFunc;
			M.vats[id].dropRule = dropRule; // -1 No dropping, 0-4 = minimum age stage
			M.vats[id].vatInfoFunc = vatInfoFunc;
			M.vats[id].holds = 0;
			M.vats[id].N = M.vatsN;
			M.vats[id].id = id;

			M.vatsN++;
			return '<div id="vat-'+ id +'" class="shadowFilter on vatsVat vatsVat'+ ((M.vats[id].N%3)+1) +'" '+Game.getDynamicTooltip('Game.ObjectsById['+M.parent.id+'].minigame.vatTooltip('+ M.vats[id].N +')', 'this')+'></div>';
		};

		var str='';
		str+='<style>'+
		'#vatsBG{background:url('+Game.resPath+'img/shadedBorders.png),url('+MMMImagePrefix+'/BGvats.png);background-size:100% 100%,auto;position:absolute;left:0px;right:0px;top:0px;bottom:16px;}'+
		'#vatsContent{position:relative;box-sizing:border-box;padding:4px;text-align:center;}'+
		
		'#vatsCenter{text-align:center;padding:8px;position:absolute;top:4px;left:35%;width:30%;height:'+M.topShelfSize+'px;box-sizing:border-box;}'+
		'#vatsLeftPanel{text-align:center;padding:8px;position:absolute;left:4px;top:4px;bottom:4px;width:34%;height:'+M.topShelfSize+'px;box-sizing:border-box;}'+
		'#vatsRightPanel{text-align:center;padding:8px;position:absolute;right:-4px;top:4px;bottom:4px;width:35%;height:'+M.topShelfSize+'px;box-sizing:border-box;}'+
		'#vatsStoragePanel{text-align:center;margin-top:'+(M.topShelfSize+8)+'px;width:100%;padding:8px;box-sizing:border-box;}'+

		'.vatsInfoLabel{margin-top:-4px;font-size:10px;color:rgba(255,255,255,0.5);}'+
		'.vatsPanelLabel{font-size:12px;width:100%;padding:2px;margin-top:4px;margin-bottom:-4px;}'+
		
		'.vatsOption{margin:0px;height:14px;pointer-events:auto;   display:inline-block;font-size:12px;padding:4px 8px;text-decoration:none;border:1px solid #e2dd48;border-color:#ece2b6 #875526 #733726 #dfbc9a;background:#000 url(img/darkNoise.jpg);background-image:url(img/shadedBordersSoft.png),url(img/darkNoise.jpg);background-size:100% 100%,auto;background-color:#000;border-radius:2px;box-shadow:0px 0px 1px 2px rgba(0,0,0,0.5),0px 2px 4px rgba(0,0,0,0.25),0px 0px 2px 2px #000 inset,0px 1px 0px 1px rgba(255,255,255,0.5) inset;text-shadow:0px 1px 1px #000;color:#ccc;line-height:100%;}'+
		'.vatsOption.off{opacity:0.5;}'+
		'.vatsOption.disabled{filter:grayscale(100%);opacity:0.5;}'+
		'.vatsOption:hover{border-color:#fff;color:#fff;text-shadow:none;}'+
		'.vatsOption:active{opacity:0.8;background:transparent;background-color:#000;}'+
		// A lot of vatsoption is inherited from a.option, stuff before the gap in the first decleration is what's really changed about it

		'.vatsSac{box-sizing:border-box;font-size:11px;font-weight:bold;padding:2px 4px;margin:1px;height:18px;display:inline-block;}'+
	
		'.debugclass{outline:1px red solid;}'+

		'.vatsVat{cursor:pointer;position:relative;color:#f33;text-shadow:0px 0px 4px #000,0px 0px 6px #000;font-weight:bold;font-size:12px;display:inline-block;width:60px;height:74px;background:url('+MMMImagePrefix+'/crudeVats.png);}'+
		'.vatsVat.on:hover{z-index:1000000001;top:-1px;}'+
		'.vatsVat.on:active{top:1px;}'+
		'.vatsVat:hover{background-position:0px -74px;} .vatsVat:active{background-position:0px 74px;}'+
		'.vatsVat1{background-position:-60px 0px;} .vatsVat1:hover{background-position:-60px -74px;} .vatsVat1:active{background-position:-60px 74px;}'+
		'.vatsVat2{background-position:-120px 0px;} .vatsVat2:hover{background-position:-120px -74px;} .vatsVat2:active{background-position:-120px 74px;}'+
		'.vatsVat3{background-position:-180px 0px;} .vatsVat3:hover{background-position:-180px -74px;} .vatsVat3:active{background-position:-180px 74px;}'+
		
		'.vatsCloneHolder{cursor:pointer;display:inline-block;position:relative;width:100%;height:100%;}'+
		'.vatsCloneIcon{pointer-events:none;width:48px;height:48px;position:relative;background:url('+MMMImagePrefix+'/vatsClones.png);z-index:11;}'+
		'.vatsCloneHolderDrag{position:absolute;left:0px;top:0px;right:0px;bottom:0px;background:#999;opacity:0;cursor:pointer;}'+
		'.vatsCloneHolder:hover .vatsCloneIcon{top:-1px;}'+
		'.vatsCloneHolder:hover .vatsCloneIcon{animation-name:bounce;animation-duration:0.8s;}'+
			'.vatsCloneHolder:hover .vatsCloneIcon.isClone{animation-iteration-count:infinite}'+
		'.vatsCloneHolder:active .vatsCloneIcon{animation-name:pucker;animation-duration:0.2s;}'+
		'.noFancy .vatsCloneHolder:hover .vatsCloneIcon{animation:none;}'+
		'.noFancy .vatsCloneHolder:active .vatsCloneIcon{animation:none;}'+

		'#vatsDrag{position:absolute;left:0px;top:0px;z-index:1000000000000;}'+
		'.vatsCloneHolder{transition:transform 0.1s;}'+
		'#vatsDrag .cloneHolder{position:absolute;left:0px;top:0px;}'+
		'.vatsDragged{pointer-events:none;}'+

		'.vatsTherapyPlaceholder{background:red;opacity:0;display:none;width:48px;height:48px;}'+
		'.vatsTherapy.disabled{filter:brightness(10%);}'+
		'.noFilters .vatsTherapy.disabled{opacity:0.2;}'+

		'.vatsCloneGrowthIndicator{background:#000;box-shadow:0px 0px 0px 1px #fff,0px 0px 0px 2px #000,2px 2px 2px 2px rgba(0,0,0,0.5);position:absolute;top:0px;width:1px;height:6px;z-index:100;}'+
		'.noFancy .vatsCloneGrowthIndicator{background:#fff;border:1px solid #000;margin-top:-1px;margin-left:-1px;}'+
		
		'.vatsTherapyEffect{font-weight:bold;font-size:11px;position:relative;margin:0px -12px;padding:4px;}'+
		'.description .vatsTherapyEffect{background:rgba(255,255,255,0.1);border-radius:4px;margin:3px;}'+
		'</style>';
		str+='<div id="vatsBG"></div>';
		str+='<div id="vatsContent">';
			str+='<div id="vatsDrag"></div>';
			str+='<div id="vatsLeftPanel">';
				str+='<div id="vatsSacrificePanel" class="framed" style="z-index:2;margin:0px;position:absolute;left:4px;top:0px;box-sizing:border-box;height:100%;width:125px;font-size:10px;padding:2px 0px;font-weight:bold;" '+Game.getDynamicTooltip('Game.ObjectsById['+M.parent.id+'].minigame.sacTooltip()','this')+'>';
					str+='<div class="title vatsPanelLabel">Sacrifice</div><div class="line"></div>';		
						str+='<div style="width:100%;box-sizing:border-box;">';
							str+='<div id="vatsSacGoLeft" style="position:absolute;left:18px;top:39px;bottom:0px;" class="vatsSac vatsOption"><</div>';
							str+='<div id="vatsSacSelected" class="vatsSac" style="padding:0px;box-sizing:border-box;width:36px;height:36px;"><div id="sacSelectedIcon" class="icon" style="transform:scale(0.75);margin-left:-6px;margin-top:-6px;height:133.333333%;width:133.333333%;background-position:0px 0px;"></div></div>';
							str+='<div id="vatsSacGoRight" style="position:absolute;right:18px;top:39px;bottom:0px;"  class="vatsSac vatsOption">></div>';
						str+='</div>';
						str+='<div style="width:100%;margin:1px 0px 6px 0px;">';
							str+='<div id="vatsSacNum">Initializing...</div>'
						str+='</div>';
						str+='<div style="width:100%">';
							str+='<div id="vatsSacAdd" class="vatsSac vatsOption">+1</div>'
								str+='<div id="vatsSacRemoveAll" class="vatsSac vatsOption">0</div>'
							str+='<div id="vatsSacRemove" class="vatsSac vatsOption">-1</div>'
						str+='</div>';
						str+='<div style="width:100%">';
							str+='<div id="vatsSacAddAll"  style="position:absolute;left:6px;bottom:2px;" class="vatsSac vatsOption">+1 All</div>'	
							str+='<div id="vatsSacReset" style="position:absolute;right:6px;bottom:2px;" class="vatsSac vatsOption">Reset</div>'
						str+='</div>';
				str+='</div>';
				str+='<div style="top:'+((M.topShelfSize/2)-35)+'px;right:0px;position:absolute;width:45%;">';
					str+=M.makeVat('synthesizerVat', 'Synthesizer',
						function(clone) {
							return;
						},
						-1,
						function() {
							if (M.synthesizerDuration != -1) {
								var str = '';
								str+='<div class="line"></div>';
								str+='A clone is being synthesized here, it has a minimum potential of <b>'+Math.round(100*M.getSynthesizeMinPotential(M.synthesizerDuration, M.getTotalSacPower(M.synthesizerSacPool)))+'%</b>.';
								str+='<div class="line"></div>';
								str+= 'Synthesis will be complete in '+M.getDurStrFromTicks(M.synthesizerTicksRemaining)+'.';
								return str;
							}
							return;
						});
					str+='<div style="margin-top:4px;width:100%">';
						str+='<a id="vatsSynthesizerStart" class="vatsOption" '+Game.getTooltip('<div style="padding:8px;width:300px;font-size:11px;text-align:center;">If this vat is empty, you can synthesize a new clone to make one here.<div class="line"></div>Buildings can be sacrificed for the synthesis to increase sacrifice power and adjust the chances of certain personalities.<div class="line"></div>Minimum potential increases with synthesize time, <b>You</b> level and sacrifice power.</div>')+'>';
							str+='<u>Begin synthesis</u>';
						str+='</a>';
						str+='<a id="vatsSynthesizerCancel" style="display:none;" class="vatsOption" '+Game.getTooltip('<div style="padding:8px;width:300px;font-size:11px;text-align:center;">Cancelling synthesizing will not refund any cookies or sacrificed buildings and will <b>not</b> create a new clone.</div>')+'>';
							str+='<u>Cancel synthesis</u>';
						str+='</a>';
					str+='</div>';
				str+='</div>';
			str+='</div>'

			str+='<div id="vatsCenter">';
				str+='<div style="position:absolute;width:100%;" class="vatsInfoLabel" id="vatsNextTick">Initializing...</div>';
				str+='<div style="text-align:center;position:absolute;top:'+ ((M.topShelfSize/2)-35) +'px;width:100%;">';
					str+='<div style="position:absolute;left:30px;top:12px;width:48px;height:48px" class="vatsCloneHolder" '+Game.getDynamicTooltip('Game.ObjectsById['+M.parent.id+'].minigame.infoTooltip()','this')+'>';
						str+='<div class="vatsCloneIcon shadowFilter" style="background-position:'+(-1*48)+'px '+(-2*48)+'px;"></div>';
					str+='</div>';
					str+=M.makeVat('primeVat', 'Prime Vat',
						function(clone) {
							return 'This clone\'s genes are being replicated onto purchased You.';
						},
						//'&bull; When a You is purchased, it will gain the genes of a clone placed here as effects.<br>&bull; Selling that You will remove its effects.', 
						4);
					str+='<div id="vatsBinHolder" style="position:absolute;right:30px;top:12px;">';
						str+='<div id="vatsBin" style="width:48px;height:48px" class="vatsCloneHolder" '+Game.getDynamicTooltip('Game.ObjectsById['+M.parent.id+'].minigame.binTooltip()','this')+'>';
							str+='<div id="vatsBinIcon" class="vatsCloneIcon shadowFilter" style="background-position:'+(-4*48)+'px '+(-2*48)+'px;"></div><div class="vatsCloneHolderDrag" id="vatsBinDrag"></div>';
						str+='</div>';
					str+='</div>';
				str+='</div>';
				str+='<div style="position:absolute;width:100%;bottom:0px;" class="vatsInfoLabel" id="vatsStatistics">Initializing...</div>';
			str+='</div>';

			str+='<div id="vatsRightPanel" style="padding-top:'+((M.topShelfSize/2)-35)+'px;">';
				str+='<div>'
					for (var i = 1; i<=2; i++)
					{
						str+=M.makeVat('combinerVat'+ i, 'Combiner Vat '+ i,
							function(clone) {
								return clone.canBePickedUp?'This clone is waiting to be fused.':'This clone is <b>busy</b> being fused with another clone.';
							},
							4);
					};
					str+='<div style="width:24px;height:24px;margin-bottom:23px;display:inline-block;background:url('+MMMImagePrefix+'/vatsClones.png);background-position:0px '+(-2*48)+'px;"></div>';
					str+=M.makeVat('combinerOutputVat', 'Combiner Output',
					function(clone) {
						return;
					},
					-1,
					function() {
							if (M.combinerTotalTicks != -1) {
								var str = '';
								str+='<div class="line"></div>';
								str+='A clone is being fused here, each of its genes have a <b>'+Math.round(100*M.getCombineDestroyChance(M.combinerTotalTicks))+'%</b> chance to be destroyed upon clone creation.';
								str+='<div class="line"></div>';
								str+= 'Fusion will be complete in '+M.getDurStrFromTicks(M.combinerTicksRemaining)+'.';
								return str;
							}
							return;
						});
				str+='</div>'
				str+='<div style="margin-top:4px;width:100%;box-sizing:border-box;">';
					str+='<a id="vatsCombinerStart" class="vatsOption" '+Game.getTooltip('<div style="padding:8px;width:300px;font-size:11px;text-align:center;">Two adult clones are required to begin fusion. This will destroy both clones and create a new adult clone.<div class="line"></div>Personality and potential will be either of the original clones\' or a number inbetween. All genes will be inherited from the original clones\'.<div class="line"></div>Each gene has a chance to be destroyed upon clone creation, this chance decreases with fusion time and <b>You</b> level.</div>')+'>';
						str+='<u>Begin fusion</u>';
					str+='</a>';
					str+='<a id="vatsCombinerCancel" style="display:none;" class="vatsOption" '+Game.getTooltip('<div style="padding:8px;width:300px;font-size:11px;text-align:center;">Cancelling fusion will not refund spent cookies and will <b>not</b> fuse clones to make a new clone.</div>')+'>';
						str+='<u>Cancel fusion</u>';
					str+='</a>';
				str+='</div>';
			str+='</div>';

			str+='<div id="vatsStoragePanel" class="framed">';
				str+='<div class="title vatsPanelLabel">'+loc("Storage")+'</div><div class="line"></div>';
				str+='<div>';
					for (var i = 1; i<=M.storageVatNum; i++) {
						str+=M.makeVat('storageVat' + i, 'Storage Vat',
							function(clone) {
								return (clone.therapy!=0?'This clone is <b>busy</b> undergoing therapy.':undefined);
							},
							//'&bull; Clones here can undergo therapy.<br>&bull; Drag a therapy onto a clone here to enact that therapy.',
							0);
					};
				str+='</div>';
				str+='<div class="title vatsPanelLabel">'+loc("Therapies")+'</div><div class="line"></div>';
				str+='<div id="vatsTherapyContainer" style="text-align:center;width:100%;padding:8px;box-sizing:border-box;">';
					for (var i in M.therapies)
					{	
						var therapy = M.therapies[i];
						str+='<div id="therapy-'+i+'" class="vatsTherapy vatsCloneHolder disabled" style="margin:2px;width:48px;height:48px" '+Game.getDynamicTooltip('Game.ObjectsById['+M.parent.id+'].minigame.therapyTooltip(\''+ i +'\')','this')+'>';
							str+='<div id="therapyIcon-'+i+'" class="vatsCloneIcon shadowFilter" style="background-position:'+(-48*therapy.icon[0])+'px '+(-48*therapy.icon[1])+'px;"></div><div class="vatsCloneHolderDrag" id="vatsTherapyDrag'+i+'"></div>';
						str+='</div>';
						str+='<div id="vatsTherapyPlaceholder'+therapy.id+'" style="margin:2px;" class="vatsTherapyPlaceholder"></div>';
					};
				str+='</div>';
				str+='<div class="line"></div>';
				str+='<small>Incubator Vats time does not progress while the game is closed.</small><br>';
				str+='<small>Clones do not reset when you ascend.</small><br>';
			str+='</div>';
		str+='</div>';
		div.innerHTML=str;
				
		for (var i in M.vats) {
			var vat = M.vats[i];
			vat.l = l('vat-'+ i)
			AddEvent(vat.l,'mouseover',function(what){return function(){M.hoverVat(what);}}(i));
			AddEvent(vat.l,'mouseout',function(what){return function(e){if (e.button==0){M.hoverVat(-1);}}}(i));
		};

		for (var i in M.therapies)
		{	
			var therapy = M.therapies[i];
			therapy.l = l('therapy-'+i);
			AddEvent(l('vatsTherapyDrag'+i),'mousedown',function(what){return function(e){if (e.button==0){M.dragWhat(what, 'therapy');}}}(therapy));
		};

		// PUT THE BIN OUT!!!
		M.bin.l = l('vatsBin');
		AddEvent(l('vatsBinDrag'),'mousedown',function(what){return function(e){if (e.button==0){M.dragWhat(what, 'bin');}}}(M.bin));
		
		AddEvent(document,'mouseup',M.dropWhat);

		var sacButtons = document.getElementsByClassName('vatsSac');
		for (var i in sacButtons) {
			AddEvent(sacButtons[i],'mouseover',function(what){return function(){M.hoverSacButton(what);}}(sacButtons[i]));
			AddEvent(sacButtons[i],'mouseout',function(what){return function(e){if (e.button==0){M.hoverSacButton(-1);}}}(sacButtons[i]));
			AddEvent(sacButtons[i],'click',function(what){return function(){
				var value = 0;
				if (!M.sacPool[M.buildingList[M.sacSelected]]) {
					M.sacPool[M.buildingList[M.sacSelected]] = 0;
				} else {
					value = M.sacPool[M.buildingList[M.sacSelected]]
				}
				if (M.sacButtonsFunctions[what.id]) {
					M.sacPool[M.buildingList[M.sacSelected]] = M.sacButtonsFunctions[what.id](value);
				};
				M.sacCapSelectionAndPool();
				M.updateGraphics = true;
				PlaySound('snd/tick.mp3');
				triggerAnim(l('vatsSacSelected'),'pucker');
				}}(sacButtons[i])
			);
		};

		AddEvent(l('vatsSynthesizerStart'),'click',function() {
			var outputFull = M.vats['synthesizerVat'].holds;
			if (!outputFull) {
				M.showTicksPrompt('Clone Synthesis', function(){return 24*20;}, [2,2], M.synthesizerCpSCostPerTick, function(value) {
					var cost = Game.cookiesPs * value * M.synthesizerCpSCostPerTick;
					if (Game.cookies>=cost) {
						Game.Spend(cost);
						M.startSynthesis(value);
					};
				},
				'<div id="vatsPromptSynthesizerStability" style="line-height:125%;"></div>',
				function(value) {
					var stabilityBreakdown = l('vatsPromptSynthesizerStability');
					if (stabilityBreakdown) {
						stabilityBreakdown.innerHTML = M.getDurStrFromTicks(value) +' of <b>Clone Synthesis</b> with <b>level '+ M.parent.level +' You</b> and <br><b>'+M.getTotalSacPower()+' sacrifice power</b> has a:<br><b>'+ Math.round(100*M.getSynthesizeMinPotential(value, M.getTotalSacPower())) + '%</b> minimum potential<br>for a newly synthesized clone.';
					};
				}
				);
			};
		});

		AddEvent(l('vatsCombinerStart'),'click',function() {
			var clone1 = M.vats['combinerVat1'].holds;
			var clone2 = M.vats['combinerVat2'].holds;
			var outputFull = M.vats['combinerOutputVat'].holds;

			if (clone1 && clone2 && !outputFull) {
				M.showTicksPrompt('Clone Fusion', function(){return 24*20;}, [2,2], M.combinerCpSCostPerTick, function(value) {
					var cost = Game.cookiesPs * value * M.combinerCpSCostPerTick;
					if (Game.cookies>=cost) {
						Game.Spend(cost);
						M.startCombiner(value);
					};
				},
				'<div id="vatsPromptCombinerInstability" style="line-height:125%;"></div>',
				function(value) {
					var instabilityBreakdown = l('vatsPromptCombinerInstability');
					if (instabilityBreakdown) {
						instabilityBreakdown.innerHTML = M.getDurStrFromTicks(value) +' of <b>Clone Fusion</b> with <b>level '+ M.parent.level +' You</b> has a:<br><b>'+ Math.round(100*M.getCombineDestroyChance(value)) + '%</b> chance<br>to destroy a gene upon clone creation.';
					};
				}
				);
			};
		});

		AddEvent(l('vatsCombinerCancel'),'click',function() {
			M.endCombiner(false);
		});

		AddEvent(l('vatsSynthesizerCancel'),'click',function() {
			M.endSynthesis(false);
		});
	}
	
	M.save = function(){
		// run when game saved - even if minigame not opened
		//output cannot use ",", ";" or "|"

		var str=''+
		parseInt(M.parent.onMinigame?'1':'0')+':'+
		parseInt(M.clonesN)+':'+
		parseInt(M.creationNum)+':'+
		parseFloat(M.nextTick)+':'+
		parseInt(M.binTicksRemaining)+':'+
		parseInt(M.combinerTicksRemaining)+':'+
		parseInt(M.combinerTotalTicks)+':'+
		parseInt(M.synthesizerDuration)+':'+
		parseInt(M.synthesizerTicksRemaining)+':'+
		'!'; // Save clone data
		for (var i in M.clones) {
			var clone = M.clones[i];
			str+=parseInt(clone.id)+':'+
			clone.name+':'+
			clone.personality+':'+
			parseInt(clone.age)+':'+
			parseFloat(clone.potential)+':'+
			parseFloat(clone.upgradeRolls)+':'+
			parseFloat(clone.upgradePower)+':'+
			clone.therapy+':'+
			parseInt(clone.therapyDurRemaining)+':'+
			clone.location+':'+
			parseInt(clone.canBePickedUp)+':'
			for (var ii in clone.stats) {
				var stat = clone.stats[ii];
				str+=stat.negative+':'+
				parseFloat(stat.weight)+':'+
				parseFloat(stat.upgradeHits)+':'+
				ii+':'
				// Power is recalculated from hits and clone potential so no need to save it
			};
			str+='?' // ? = end of a sub save
		};
		str+='!'; // Save youStats
		for (var youNum in M.youStats) {
			var data = M.youStats[youNum];
			str+=youNum+':'+
			data.copiedCloneName+':'+
			parseFloat(data.potential)+':'
			for (var ii in data.stats) {
				var stat = data.stats[ii];
				str+=stat.negative+':'+
				parseFloat(stat.upgradeHits)+':'+
				ii+':'
				// Power is recalculated from hits and potential so no need to save it
			};
			str+='?' // ? = start of a sub save
		};
		str+='!'; // Save synth sac pool
		for (var building in M.synthesizerSacPool) {
			str+=building+':'+
			parseInt(M.synthesizerSacPool[building])+':'
		};

		console.log('Saving incubator vats:');
		console.log(str);

		return str;
	}
	
	M.load = function(str){
		//interpret str; called after .init
		//note : not actually called in the Game's load; see "minigameSave" in main.js
		if(!str) return false;
		console.log('Loading incubator vats:');
		console.log(str);
		var si=0;
		var spl=str.split('!');
		var si2=0;
		var spl2=spl[si++].split(':');
		var on=parseInt(spl2[si2++]||0);if (on && Game.ascensionMode!=1) M.parent.switchMinigame(1);
		M.clonesN=parseInt(spl2[si2++]||M.clonesN);
		M.creationNum=parseInt(spl2[si2++]||M.creationNum);
		M.nextTick=parseFloat(spl2[si2++]||M.nextTick);
		M.binTicksRemaining=parseInt(spl2[si2++]||M.binTicksRemaining);
		M.combinerTicksRemaining=parseInt(spl2[si2++]||M.combinerTicksRemaining);
		M.combinerTotalTicks=parseInt(spl2[si2++]||M.combinerTotalTicks);
		M.synthesizerDuration=parseInt(spl2[si2++]||M.synthesizerDuration);
		M.synthesizerTicksRemaining=parseInt(spl2[si2++]||M.synthesizerTicksRemaining);
		var cloneData=spl[si++]||'';
		if (cloneData) {
			var cloneNum = 0
			var clones = cloneData.split('?');
			for (var i in clones[cloneNum]) {
				var di = 0;
				var splc = clones[cloneNum].split(':');
				if (splc[di]!='' && splc[di]!=undefined) {
					var id = parseInt(splc[di++]);
					var name = splc[di++];
					var personality = splc[di++];
					var age = parseInt(splc[di++]);
					var potential = parseFloat(splc[di++]);
					var upgradeRolls = parseFloat(splc[di++]);
					var upgradePower = parseFloat(splc[di++]);
					var therapy = splc[di++];
					var therapyDurRemaining = parseInt(splc[di++]);
					var location = splc[di++];
					var canBePickedUp = parseInt(splc[di++]);
					var stats = {};
					for (var ii = di; (splc[ii]!='' && splc[ii] != undefined); ii) {
						if (splc[ii]!='' && splc[ii] != undefined) {
							var statData = {};
							statData.negative = splc[ii++]=='true';
							statData.weight = parseFloat(splc[ii++]);
							statData.upgradeHits = parseFloat(splc[ii++]);
							stats[splc[ii++]] = statData;
						};
					};
					new M.clone(name, location, personality, potential, age, upgradePower, upgradeRolls, stats, therapy, therapyDurRemaining, canBePickedUp, id, true);
					M.calculateStatValues(M.lastClone.potential, M.lastClone.stats);
					cloneNum++;
				};
			};
		};
		var youStats=spl[si++]||'';
		if (youStats) {
			var youNum = 0
			var yous = youStats.split('?');
			for (var i in yous[youNum]) {
				var di = 0;
				var sply = yous[youNum].split(':');
				if (sply[di]!='' && sply[di]!=undefined) {
					var youData = {};
					var stats = {};
					var youId = sply[di++];
					youData.copiedCloneName = sply[di++];
					youData.potential = parseFloat(sply[di++]);
					for (var ii = di; (sply[ii]!='' && sply[ii] != undefined); ii) {
						if (sply[ii]!='' && sply[ii] != undefined) {
							var statData = {};
							statData.negative = sply[ii++]=='true';
							statData.upgradeHits = parseFloat(sply[ii++]);
							statData.power = 0;
							stats[sply[ii++]] = statData;
						};
					};
					youData.stats = stats;
					M.youStats[youId] = youData;
					M.calculateStatValues(M.youStats[youId].potential, M.youStats[youId].stats);
					youNum++;
				};
			};
		};
		var synthSacPool=spl[si++]||'';
		if (synthSacPool) {
			var spls = synthSacPool.split(':');
			for (var di = 0; (spls[di]!='' && spls[di]!=undefined); di) {
				if (spls[di]!='' && spls[di]!=undefined) {
					M.synthesizerSacPool[spls[di++]] = parseInt(spls[di++]);
				};
			};
		};

		// + Pray to god that this works

		M.toCompute = true;

		M.saveString = str;
	}
	
	M.reset = function(hard){
		// run when returning from an ascension, hard = 1 if full reset
		M.creationNum = 0;
		if (hard) {
			M.clonesN = 0;
			M.clones = {};
			M.lastClone = 0;
			M.nextTick = Date.now() + (M.tickDur * 1000);
			M.youStats = {};
			M.binTicksRemaining = -1;
			M.combinerTicksRemaining = -1;
			M.combinerTotalTicks = -1;
			M.synthesizerSacPool = {};
			M.synthesizerDuration = -1;
			M.synthesizerTicksRemaining = -1;
			M.sacPool = {};
			M.sacSelected = 0;
		};

		M.toCompute = true;
	}
	
	M.logic = function(){
		//run each frame even if closed
		var now = Date.now();
		M.nextTick = Math.min(M.nextTick, now + (M.tickDur*1000));

		if (now >= M.nextTick) {
			M.nextTick = now + (M.tickDur*1000);

			for (var i in M.clones) {
				var clone = M.clones[i];
				var oldStage = clone.ageBracket();
				
				clone.age = Math.min(clone.age + 1, M.ageBrackets[4]);

				if (clone.therapy && clone.therapyDurRemaining > 0) {
					clone.therapyDurRemaining -= 1;
					if (clone.therapyDurRemaining <= 0) {
						M.removeTherapy(clone);
					} else {
						M.therapies[clone.therapy].passiveFunc(clone);
					};
				};

				if (oldStage != clone.ageBracket()) {
					clone.growUpFunc();
				};
			};

			if (M.binTicksRemaining > 0) {
				M.binTicksRemaining --;
				if (M.binTicksRemaining <= 0) {
					M.bin.canBePickedUp = 1;
					triggerAnim(M.bin.l,'pucker');
					l('vatsBinIcon').style.backgroundPosition = (-4*48)+'px '+(-2*48)+'px'
				};
			};
			
			if (M.combinerTotalTicks > 0) {
				M.combinerTicksRemaining --;
				if (M.combinerTicksRemaining <= 0) {
					M.endCombiner(true);
				};
			};

			if (M.synthesizerDuration > 0) {
				M.synthesizerTicksRemaining --;
				if (M.synthesizerTicksRemaining <= 0) {
					M.endSynthesis(true);
				};
			};

			if (M.toCompute) {
				M.computeEffs()
			};
		};

		for (var i in M.therapies) {
			var therapy = M.therapies[i];
			therapy.canBePickedUp = M.parent.amount >= therapy.youRequirement;
		};

		if ((Game.keys[16] || Game.keys[17]) && !M.sacBulkShortcutOn)
		{
			M.sacAmountOld=M.sacAddAmount;
			if (Game.keys[16]) M.sacAddAmount=100;
			if (Game.keys[17]) M.sacAddAmount=10;
			M.sacBulkShortcutOn=1;
		};
		if ((!Game.keys[16] && !Game.keys[17]) && M.sacBulkShortcutOn)//release
		{
			M.sacAddAmount=M.sacAmountOld;
			M.sacBulkShortcutOn=0;
		};

		if (l('vatsCombinerStart')) {
			var active = M.combinerTotalTicks > 0;
			if (active && l('vatsCombinerStart').style.display == '') {
				var str = '';
				str+='<div id="cloneConception-combinerVat" class="vatsCloneHolder">';
					str+='<div id="cloneConceptionIcon-combinerVat" class="shadowFilter vatsCloneIcon isClone" style="margin:12px 6px 0px 6px;background-position:'+(-5*48)+'px 0px;"></div>';
				str+='</div>';
				l('vatsCombinerStart').style.display = 'none';
				l('vatsCombinerCancel').style.display = '';
				M.vats['combinerOutputVat'].l.innerHTML = str;
			};
			if (!active && l('vatsCombinerStart').style.display == 'none') {
				l('vatsCombinerStart').style.display = '';
				l('vatsCombinerCancel').style.display = 'none';
				if (l('cloneConception-combinerVat')) l('cloneConception-combinerVat').remove();
			};
		};

		if (l('vatsSynthesizerStart')) {
			var active = M.synthesizerDuration > 0;
			if (active && l('vatsSynthesizerStart').style.display == '') {
				var str = '';
				str+='<div id="cloneConception-synthesizerVat" class="vatsCloneHolder">';
					str+='<div id="cloneConceptionIcon-synthesizerVat" class="shadowFilter vatsCloneIcon isClone" style="margin:12px 6px 0px 6px;background-position:'+(-5*48)+'px 0px;"></div>';
				str+='</div>';
				l('vatsSynthesizerStart').style.display = 'none';
				l('vatsSynthesizerCancel').style.display = '';
				M.vats['synthesizerVat'].l.innerHTML = str;
			};
			if (!active && l('vatsSynthesizerStart').style.display == 'none') {
				l('vatsSynthesizerStart').style.display = '';
				l('vatsSynthesizerCancel').style.display = 'none';
				if (l('cloneConception-synthesizerVat')) l('cloneConception-synthesizerVat').remove();
			};
		};

		if (l('vatsCombinerStart') && M.vats['combinerOutputVat']) {
			var canStart = M.vats['combinerVat1'].holds && M.vats['combinerVat2'].holds && !M.vats['combinerOutputVat'].holds
			if (!canStart && !l('vatsCombinerStart').classList.contains('disabled')) {
				l('vatsCombinerStart').classList.add('disabled');
				triggerAnim(l('vatsCombinerStart'),'pucker');
			};
			if (canStart && l('vatsCombinerStart').classList.contains('disabled')) {
				l('vatsCombinerStart').classList.remove('disabled');
				triggerAnim(l('vatsCombinerStart'),'pucker');
			};
		};

		if (l('vatsSynthesizerStart') && M.vats['synthesizerVat']) {
			var canStart = !M.vats['synthesizerVat'].holds
			if (!canStart && !l('vatsSynthesizerStart').classList.contains('disabled')) {
				l('vatsSynthesizerStart').classList.add('disabled');
				triggerAnim(l('vatsSynthesizerStart'),'pucker');
			};
			if (canStart && l('vatsSynthesizerStart').classList.contains('disabled')) {
				l('vatsSynthesizerStart').classList.remove('disabled');
				triggerAnim(l('vatsSynthesizerStart'),'pucker');
			};
		};
	}
	
	M.onResize = function(){
		// run whenever the window is resized
		var width = l('vatsContent').offsetWidth;
	}
	
	M.draw = function(){
		//run each draw frame - when minigame is open
		if (M.dragging)
		{	
			var box=l('vatsDrag').getBounds();
			var x=Game.mouseX-box.left-((box.right-box.left)/2);
			var y=Game.mouseY-box.top-((box.bottom-box.top)/2)+TopBarOffset;
			if (M.vatHovered!=-1)//snap to slots
			{
				var box2=l('vat-'+M.vatHovered).getBounds();
				if (M.draggingType == 'therapy' || M.draggingType == 'bin') { // I can't make this work with clones as well and I have no idea why
					x=(box2.left+((box2.right-box2.left)/2))-(box.left+((box.right-box.left)/2));
					y=(box2.top+((box2.bottom-box2.top)/2))-(box.top+((box.bottom-box.top)/2));
				} else {
					x=box2.left-box.left;
					y=box2.top-box.top;
				};
			};
			M.dragging.l.style.transform='translate('+(x)+'px,'+(y)+'px)';
		};
		if (Game.drawT%10 == 0 || M.updateGraphics) {
			var selected = M.buildingList[M.sacSelected];
			l('vatsNextTick').innerHTML = 'Next tick in '+ Game.sayTime((M.nextTick-Date.now())/1000*Game.fps+Game.fps,-1) +'.';
			l('vatsStatistics').innerHTML = 'Clones created: '+ M.creationNum +' (total: '+ M.clonesN +').';
			l('sacSelectedIcon').style.backgroundPosition = (Game.Objects[M.buildingList[M.sacSelected]].iconColumn*-48)+'px 0px';
			l('vatsSacNum').innerHTML = ((M.sacPool[selected]?M.sacPool[selected]:0)+'/'+(Math.min(M.sacMax, Game.Objects[selected].amount)))
			l('vatsSacAdd').innerHTML = '+'+ M.sacAddAmount;
			l('vatsSacRemove').innerHTML = '-'+ M.sacAddAmount;
			l('vatsSacAddAll').innerHTML = '+'+ M.sacAddAmount+' All';
			for (var i in M.therapies) {
				var therapy = M.therapies[i];
				if (M.parent.amount < therapy.youRequirement) {
					therapy.l.classList.add('disabled');
				} else {
					therapy.l.classList.remove('disabled');
				};
			};
		};
	}
	
	M.init(l('rowSpecial' + M.parent.id));
}

var M = 0;