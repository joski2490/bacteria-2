var environment = function(params) {

    var bacteria_list = [];
    var resources = createRegion({
        granularity: params.granularity,
        color: {
            red: 0,
            green: 200,
            blue: 0
        },
        max: 100
    });
    var water = createRegion({
        granularity: params.granularity,
        color: {
            red: 0,
            green: 0,
            blue: 200
        },
        max: 100
    });

    resources.set(params.center.x,params.center.y,100);
    for(var r=params.granularity; r<=4*params.granularity; r+=params.granularity){
        for(var i=params.center.x-r; i<=params.center.x+r; i+=params.granularity){
            var ratio = params.granularity * 100/r;
            resources.set(i,params.center.y-r, ratio);
            resources.set(i,params.center.y+r, ratio);
            resources.set(params.center.x-r,i, ratio);
            resources.set(params.center.x+r,i, ratio);
        }
    }
    for(var r=5*params.granularity; r<=8*params.granularity; r+=params.granularity){
        for(var i=params.center.x-r; i<=params.center.x+r; i+=params.granularity){
            var ratio = 20;
            water.set(i,params.center.y-r, ratio);
            water.set(i,params.center.y+r, ratio);
            water.set(params.center.x-r,i, ratio);
            water.set(params.center.x+r,i, ratio);
        }
    }


    water.set(100,100,50);

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

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
    };

    function drawAll(ctx){
        resources.draw(ctx);
        water.draw(ctx);
        bacteria_list.forEach(function(b){b.draw(ctx);})
    };

    function moveAll(){
        bacteria_list.forEach(function(b){
            b.move();
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
            }
        });

        bacteria_list = new_list;
    };

    function reproduceAll(){
        for(var i=0; i<bacteria_list.length; i++){
            var newBact = bacteria_list[i].reproduce();
            if(newBact !== null) {
                addBacteria(newBact);
                console.log('new !');
            }
        }
    };

    function regionEffects(){
        bacteria_list.forEach(function(b){
            resources.hover(b);
            water.hover(b);
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
    };
}({
    center: {
        x: 400,
        y: 400
    },
    granularity: 10,
    proba: {
        eat: 0.5
    }
});
