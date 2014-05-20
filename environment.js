var environment = function(params) {

    var bacteria_list = [];
    var resources = [];

    setResource(params.center.x,params.center.y,100);
    for(var r=params.granularity; r<=10*params.granularity; r+=params.granularity){
        for(var i=params.center.x-r; i<=params.center.x+r; i+=params.granularity){
            var ratio = 400/r;
            if(i==params.center.x-r || i==params.center.x+r){
                ratio = 200/r;
            }
            setResource(i,params.center.y-r, ratio);
            setResource(i,params.center.y+r, ratio);
            setResource(params.center.x-r,i, ratio);
            setResource(params.center.x+r,i, ratio);
        }
    }

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
    };

    function getResource(x, y, r){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity),
            result;

        if(resources[i] === undefined || resources[i][j] === undefined){
            result = 0;
        } else {
            result = Math.min(resources[i][j], r);
            resources[i][j] -= result;
        }

        return result;
    };

    function setResource(x, y, r){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity);
        if(resources[i] === undefined){
            console.log('create ['+i+'][]');
            resources[i] = [];
        }
        if(resources[i][j] === undefined){
            console.log('set ['+i+']['+j+']');
            resources[i][j] = r;
        } else {
            console.log('addto ['+i+']['+j+']');
            resources[i][j] += r;
        }
    };

    function drawResources(ctx){
        for(var i=0; i<resources.length; i++){
            if(resources[i] !== undefined){
                for(var j=0; j<resources[i].length; j++){
                    if(resources[i][j] !== undefined){
                        var alpha = Math.min(resources[i][j] / 100, 1);
                        ctx.fillStyle = "rgba(0,200,0,"+alpha+")";
                        console.log('draw resource with alpha : '+alpha);
                        ctx.fillRect(i*params.granularity, j*params.granularity, params.granularity, params.granularity);
                    }
                }
            }
        }
    };

    function drawAll(ctx){
        drawResources(ctx);
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
                setResource(bact_coords.x, bact_coords.y, 10);
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
                b.eat(getResource(bact_coords.x, bact_coords.y, 1));
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
    granularity: 10,
    proba: {
        eat: 0.5
    }
});
