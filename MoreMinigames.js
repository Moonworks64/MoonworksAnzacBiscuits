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
        Game.registerHook('logic',function(){Game.Notify('Logic went!','',0,0.5);});
        Game.registerHook('click', function() {
            Game.Notify(choose(['A good click.','A solid click.','A mediocre click.','An excellent click!']),'',0,0.5);
            Game.gainBuff('blood frenzy', Math.ceil(1), 666);
        });
    },
    save:function(){
        //note: we use stringified JSON for ease and clarity but you could store any type of string
        return ''
    },
    load:function(str){
        
    },
});