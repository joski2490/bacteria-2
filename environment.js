var environment = function(params) {

    const MODULE_NAME = "bact.environnement";
    function log(message){
        logger.log(MODULE_NAME, message);
    }
    function debug(message){
        logger.debug(MODULE_NAME, message);
    }
    function warn(message){
        logger.warn(MODULE_NAME, message);
    }

    var bacteria_list = [];
    //var specCount = [0,0,0];
    var resources = createRegion({
        granularity: params.granularity,
        color: {
            red: 0,
            green: 200,
            blue: 0
        },
        max: 500
    });
    var fire = createRegion({
        granularity: params.granularity,
        color: {
            red: 255,
            green: 150,
            blue: 0
        },
        max: 50
    });
    var water = createRegion({
        granularity: params.granularity,
        color: {
            red: 0,
            green: 0,
            blue: 200
        },
        max: 500
    });
    var bact_index = createRegion({
        granularity: params.granularity,
        color: {
            red: 200,
            green: 0,
            blue: 0
        },
        max: 250
    });

    function presetRegion(region, min, max, ratioFunc){
        for(var r=min*params.granularity; r<=max*params.granularity; r+=params.granularity){
            for(var i=params.center.x-r; i<=params.center.x+r; i+=params.granularity){
                var ratio = ratioFunc(r);
                region.set(i,params.center.y-r, ratio);
                region.set(i,params.center.y+r, ratio);
                region.set(params.center.x-r,i, ratio);
                region.set(params.center.x+r,i, ratio);
            }
        }
    }

    resources.set(params.center.x,params.center.y,100*3);
    presetRegion(resources, 1, 5, function(r){return params.granularity * 100/r});
    presetRegion(water, 7, 8, function(r){return 20});
    presetRegion(fire, 9, 9, function(r){return 5});

    resources.onhover(function(b){
        if(Math.random()<params.proba.eat){
            var bact_coords = b.getCoords();
            b.eat(resources.pop(bact_coords.x, bact_coords.y, 1));
        }
    });
    water.onhover(function(b){
        var bact_coords = b.getCoords();
        if(water.get(bact_coords.x, bact_coords.y) > 0){
            b.setUnderwater(true);
        } else {
            b.setUnderwater(false);
        }
    });
    fire.onhover(function(b){
        var bact_coords = b.getCoords();
        if(fire.get(bact_coords.x, bact_coords.y) > 0){
            b.die();
        }
    });
    fire.ondraw(function(i, j){
        var x = i*params.granularity,
            y = j*params.granularity;
        var value = Math.min(Math.max(fire.get(x,y) + (Math.random() - 0.5)/5 , 3) ,8)
        fire.set(x, y, value);
    });
    bact_index.onhover(function(b){
        var bact_coords = b.getCoords();
        var current_list = bact_index.get(bact_coords.x,bact_coords.y);
        var attack_proba = Math.min(params.proba.max_attack, params.proba.attack * current_list.length);

        if(Math.random() < attack_proba){
            if(current_list.length > 1){
                var bact_list = [];

                current_list.forEach(function(b2){
                    if(b !== b2){
                        bact_list.push(b2);
                    }
                });
                var rand_bact_index = Math.floor(Math.random()*bact_list.length);

                b.attack(bact_list[rand_bact_index]);
            }
        }
    });

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
        var bact_coords = bacteria.getCoords();
        bact_index.push(bact_coords.x, bact_coords.y, bacteria);
        log('adding '+bacteria._hash+' at ('+bact_coords.x+", "+bact_coords.y+')');
    };

    function drawAll(ctx){
        resources.draw(ctx);
        water.draw(ctx);
        fire.draw(ctx);
        bact_index.draw(ctx);
        bacteria_list.forEach(function(b){b.draw(ctx);})
    };

    function moveAll(){
        bacteria_list.forEach(function(b){
            var bact_coords = b.getCoords();
            debug('moving bacteria '+b._hash+' ('+bact_coords.x+", "+bact_coords.y+')');
            if(bact_index.pop(bact_coords.x, bact_coords.y, b) === undefined){
                warn('bacteria '+b._hash+' cant be found in index ('+bact_coords.x+", "+bact_coords.y+') !');
            }else{
                debug('poping '+b._hash+' successful');
            }

            b.move();

            bact_coords = b.getCoords();
            bact_index.push(bact_coords.x, bact_coords.y, b);
            debug('pushing '+b._hash+' at ('+bact_coords.x+", "+bact_coords.y+')');
        })
    };

    function clean(){
        var new_list = [];
        bacteria_list.forEach(function(b){
            if(!b.isDead()) {
                new_list.push(b);
            } else {
                var bact_coords = b.getCoords();
                resources.push(bact_coords.x, bact_coords.y, 10);
                bact_index.pop(bact_coords.x, bact_coords.y, b);
            }
        });

        bacteria_list = new_list;
    };

    function reproduceAll(){
        for(var i=0; i<bacteria_list.length; i++){
            var newBact = bacteria_list[i].reproduce();
            if(newBact !== null) {
                addBacteria(newBact);
                debug('new bact !');
            }
        }
    };

    function regionEffects(){
        bacteria_list.forEach(function(b){
            resources.hover(b);
            water.hover(b);
            fire.hover(b);
            bact_index.hover(b);
        });
    };

    function mainLoop(ctx){
        drawAll(ctx);
        moveAll();
        reproduceAll();
        clean();
        regionEffects();
    };

    return {
        addBacteria: addBacteria,
        getLength: function (){return bacteria_list.length;},
        mainLoop: mainLoop,
        _index: bact_index,
    //    specCount: function (){return {red:specCount[0],green:specCount[1],blue:specCount[2];};},
    };
}({
    center: {
        x: 400,
        y: 400
    },
    granularity: 15,
    proba: {
        eat: 0.5,
        attack: 0.01,
        max_attack: 0.15,
    }
});
