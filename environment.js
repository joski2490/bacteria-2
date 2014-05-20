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

    resources.pushValue(params.center.x,params.center.y,100);
    for(var r=params.granularity; r<=4*params.granularity; r+=params.granularity){
        for(var i=params.center.x-r; i<=params.center.x+r; i+=params.granularity){
            var ratio = 400/r;
            if(i==params.center.x-r || i==params.center.x+r){
                ratio = 200/r;
            }
            resources.pushValue(i,params.center.y-r, ratio);
            resources.pushValue(i,params.center.y+r, ratio);
            resources.pushValue(params.center.x-r,i, ratio);
            resources.pushValue(params.center.x+r,i, ratio);
        }
    }

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
    };

    function drawAll(ctx){
        resources.drawValues(ctx);
        ctx.fillStyle = "rgb(0,0,0)";
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
                resources.pushValue(bact_coords.x, bact_coords.y, 10);
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

    function nourrishAll(){
        bacteria_list.forEach(function(b){
            if(Math.random()<params.proba.eat){
                var bact_coords = b.getCoords();
                b.eat(resources.popValue(bact_coords.x, bact_coords.y, 1));
            }
        });
    };

    function mainLoop(ctx){
        drawAll(ctx);
        moveAll();
        reproduceAll();
        clean();
        nourrishAll();
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
    granularity: 40,
    proba: {
        eat: 0.5
    }
});
