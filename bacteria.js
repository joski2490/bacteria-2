function generateBacteria()
{
    var x = 400 + (Math.random()*100 - 50);
    var y = 400 + (Math.random()*100 - 50);

    return {
        draw: function (ctx){
            ctx.fillRect(x-1,y-1,2,2);
        }
    };
}
