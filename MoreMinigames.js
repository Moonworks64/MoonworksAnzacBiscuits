//EXAMPLE MOD
Game.registerMod('MoonworksMoreMinigames',{
    init:function(){
        Game.registerHook('click', function() {
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