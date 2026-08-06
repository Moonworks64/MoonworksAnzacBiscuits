//EXAMPLE MOD

/*
basic buff parameters :
    name:'Kitten rain',
    desc:'It\'s raining kittens!',
    icon:[0,0],
    time:30*Game.fps
other parameters :
    visible:false - will hide the buff from the buff list
    add:true - if this buff already exists, add the new duration to the old one
    max:true - if this buff already exists, set the new duration to the max of either
    onDie:function(){} - function will execute when the buff runs out
    power:3 - used by some buffs
    multCpS:3 - buff multiplies CpS by this amount
    multClick:3 - buff multiplies click power by this amount
*/

Game.registerMod('MoonworksMoreMinigames',{
     testFunction:function(str) {

    },
    init:function(){
        Game.registerHook('click', function() {
            var old = Game.hasBuff('blood frenzy');
            if (old)
            {
                old.multCpS *= 2;
            }
            else
            {
                Game.gainBuff('blood frenzy', 1, 666);
            }
        });
        Game.Notify('Hey! My mod should be loaded!', 'This is a description!', [10, 22]);
    },
    save:function(){
        //note: we use stringified JSON for ease and clarity but you could store any type of string
        return ''
    },
    load:function(str){
        
    },
});