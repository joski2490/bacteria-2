function generateBacteria()
{
    var x = 400 + (Math.random()*100 - 50);
    var y = 400 + (Math.random()*100 - 50);

    var dx = Math.random() - 0.5;
    var dy = Math.random() - 0.5;

    return {
        draw: function (ctx){
            ctx.fillRect(x-1,y-1,2,2);
        },
        move: function(){
            x += dx;
            y += dy;
            dx = Math.random() - 0.5;
            dy = Math.random() - 0.5;
        },
        generateBacteria: generateBacteria
    };
}
