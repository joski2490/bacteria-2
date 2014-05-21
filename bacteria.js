function generateBacteria(init_vars)
{
    if(init_vars === undefined){
        var init_vars = {
            x: 400 + (Math.random() * 100 - 50),
            y: 400 + (Math.random() * 100 - 50),
            move_balance_x: 0.5,
            move_balance_y: 0.5,
            color: {
                red:0,
                green:0,
                blue:0
            },
            state: {
                water_resistance: 0.5
            },
        }
    }

    //fixed
    var params = {
        proba: {
            reproduction: 0.005,
            mutation: 0.1
        },
        color: {
            variation: 200
        },
        state: {
            health: 200,
            death_rate: 1
        }
    };

    var x = init_vars.x;
    var y = init_vars.y;

    var dx = Math.random() - init_vars.move_balance_x;
    var dy = Math.random() - init_vars.move_balance_y;
    var health = params.state.health;
    var living = true;
    var underwater = false;

    function reproduceSelf(){
        var move_balance_x = init_vars.move_balance_x;
        var move_balance_y = init_vars.move_balance_y;
        var color_red = init_vars.color.red;
        var color_green = init_vars.color.green;
        var color_blue = init_vars.color.blue;
        var water_resist = init_vars.state.water_resistance;

        var mut_proba = params.proba.mutation + Math.min(get_death_rate(),10)/20;
        if(Math.random() < mut_proba){
            move_balance_x += move_balance_x * (Math.random() - 0.5) * 2 * 0.25;
            move_balance_y += move_balance_y * (Math.random() - 0.5) * 2 * 0.25;
            console.log('new movebalance : ' + move_balance_x + ';' + move_balance_y);

            color_red += Math.floor(Math.random() * params.color.variation - params.color.variation/2);
            color_green += Math.floor(Math.random() * params.color.variation - params.color.variation/2);
            color_blue += Math.floor(Math.random() * params.color.variation - params.color.variation/2);

            color_red = Math.min(Math.max(color_red, 0), 255);
            color_green = Math.min(Math.max(color_green, 0), 255);
            color_blue = Math.min(Math.max(color_blue, 0), 255);

            water_resist = 1 / (Math.random() * 100);
        }
        var parent_vars = {
            x: x,
            y: y,
            move_balance_x: move_balance_x,
            move_balance_y: move_balance_y,
            color: {
                red:color_red,
                green:color_green,
                blue:color_blue
            },
            state: {
                water_resistance: water_resist
            }
        };

        return generateBacteria(parent_vars)
    };

    function get_death_rate(){
        var dying_rate = params.state.death_rate;
        if(underwater){
            dying_rate += params.state.death_rate / init_vars.state.water_resistance;
        } else {
            dying_rate += params.state.death_rate * init_vars.state.water_resistance;
        }

        return dying_rate;
    }

    return {
        draw: function (ctx){
            ctx.fillStyle = "rgb(" + init_vars.color.red + "," + init_vars.color.green + "," + init_vars.color.blue + ")";
            ctx.fillRect(x-1,y-1,2,2);
        },
        move: function(){
            if(living){
                if(health<=0){
                    living = false;
                } else {
                    health -= get_death_rate();
                    x += dx;
                    y += dy;

                    x = Math.min(Math.max(x,0),800);
                    y = Math.min(Math.max(y,0),800);

                    dx = Math.random() - init_vars.move_balance_x;
                    dy = Math.random() - init_vars.move_balance_y;
                }
            }
        },
        reproduce: function(){
            var result = null;
            var repro_proba = params.proba.reproduction + Math.min(get_death_rate(),10)/1000;
            if(living && Math.random() < repro_proba){
                result = reproduceSelf();
            }
            return result;
        },
        isDead: function(){return !living;},
        getCoords: function() {return {x:x,y:y};},
        eat: function(r) {health += r;},
        setUnderwater: function(isWater) {underwater = isWater;}
    };
}
