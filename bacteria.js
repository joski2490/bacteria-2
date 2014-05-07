function generateBacteria(x,y)
{
    if(x === undefined){
        x = 400 + (Math.random() * 100 - 50);
    }
    if(y === undefined){
        y = 400 + (Math.random() * 100 - 50);
    }

    var dx = Math.random() - 0.5;
    var dy = Math.random() - 0.5;
    var health = 200;
    var living = true;

    return {
        draw: function (ctx){
            ctx.fillRect(x-1,y-1,2,2);
        },
        move: function(){
            if(health<=0){
                living = false;
            } else {
                health -= 1;
                x += dx;
                y += dy;
                dx = Math.random() - 0.5;
                dy = Math.random() - 0.5;
            }
        },
        generateBacteria: function(){return generateBacteria(x,y)},
        isDead: function(){return !living;}
    };
}
