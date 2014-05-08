function generateBacteria(init_vars)
{
    if(init_vars === undefined){
        var init_vars = {
            x: 400 + (Math.random() * 100 - 50),
            y: 400 + (Math.random() * 100 - 50),
            move_balance: 0.5
        }
    }

    var x = init_vars.x;
    var y = init_vars.y;

    var dx = Math.random() - init_vars.move_balance;
    var dy = Math.random() - init_vars.move_balance;
    var health = 200;
    var living = true;

    function reproduceSelf(){
        var move_balance = init_vars.move_balance;
        if(Math.random()<0.1){
            move_balance += move_balance * (Math.random() - 0.5) * 2 * 0.25;
            console.log('new movebalance : ' + move_balance);
        }
        var parent_vars = {
            x: x,
            y: y,
            move_balance: move_balance
        };
        return generateBacteria(parent_vars)
    };

    return {
        draw: function (ctx){
            ctx.fillRect(x-1,y-1,2,2);
        },
        move: function(){
            if(living){
                if(health<=0){
                    living = false;
                } else {
                    health -= 1;
                    x += dx;
                    y += dy;
                    dx = Math.random() - init_vars.move_balance;
                    dy = Math.random() - init_vars.move_balance;
                }
            }
        },
        reproduce: function(){
            var result = null;
            if(living && Math.random()<0.005){
                result = reproduceSelf();
            }
            return result;
        },
        isDead: function(){return !living;}
    };
}
