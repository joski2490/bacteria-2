var environment = function() {

    var bacteria_list = [];
    var resources = [];

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
    };

    function getResource(x, y){
        var i = Math.floor(x/10),
            j = Math.floor(y/10),
            result;

        if(resources[i] === undefined || resources[i][j] === undefined){
            result = 0;
        } else {
            result = resources[i][j];
        }

    };

    function setResource(x, y, r){
        var i = Math.floor(x/10),
            j = Math.floor(y/10);
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
                        var alpha = Math.max(resources[i][j] / 100, 1);
                        ctx.fillStyle = "rgba(0,200,0,"+alpha+")";
                        ctx.fillRect(x,y,10,10);
                    }
                }
            }
        }
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

    return {
        addBacteria: addBacteria,
        drawAll: function(ctx){
            drawResources(ctx);
            ctx.fillStyle = "rgb(0,0,0)";
            bacteria_list.forEach(function(b){b.draw(ctx);})
        },
        moveAll: function(){bacteria_list.forEach(function(b){b.move();})},
        getLength: function (){return bacteria_list.length;},
        reproduceAll: reproduceAll,
        clean: clean
    };
}();
