//EXAMPLE MOD
    Game.registerMod('MoonworksMoreMinigames',{
        /*
            what this example mod does:
            -double your CpS
            -display a little popup for half a second whenever you click the big cookie
            -add a little intro text above your bakery name, and generate that intro text at random if you don't already have one
            -save and load your intro text
        */
        init:function(){
            Game.registerHook('reincarnate',function(){Game.mods['test mod'].addIntro();});
            Game.registerHook('check',function(){if (!Game.playerIntro){Game.mods['test mod'].addIntro();}});
            Game.registerHook('logic',function(){Game.Notify('Logic went!','',0,0.5);});
            Game.registerHook('click', function() {
                Game.Notify(choose(['A good click.','A solid click.','A mediocre click.','An excellent click!']),'',0,0.5);
                Game.gainBuff('blood frenzy', Math.ceil(1), 666);
            });
        },
        save:function(){
            //note: we use stringified JSON for ease and clarity but you could store any type of string
            return JSON.stringify({text:Game.playerIntro})
        },
        load:function(str){
            var data=JSON.parse(str);
            if (data.text) Game.mods['test mod'].addIntro(data.text);
        },
        addIntro:function(text){
            //note: this is not a mod hook, just a function that's part of the mod
            Game.playerIntro = text || choose(['oh snap, it\'s','watch out, it\'s','oh no! here comes','hide your cookies, for here comes','behold! it\'s']);
            if (!l('bakerySubtitle')) l('bakeryName').insertAdjacentHTML('afterend','<div id="bakerySubtitle" class="title" style="text-align:center;position:absolute;left:0px;right:0px;bottom:32px;font-size:12px;pointer-events:none;text-shadow:0px 1px 1px #000,0px 0px 4px #f00;opacity:0.8;"></div>');
            l('bakerySubtitle').textContent='~'+Game.playerIntro+'~';
        },
    });