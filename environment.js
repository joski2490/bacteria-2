var environment = function() {

    var bacteria_list = [];

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
    }

    function reproduce(){
        for(var i=0; i<bacteria_list.length; i++){
            if(Math.random()<0.005){
                addBacteria(bacteria_list[i].generateBacteria());
                console.log('new !');
            }
        }
    }

    return {
        addBacteria: addBacteria,
        drawAll: function(ctx){bacteria_list.forEach(function(b){b.draw(ctx);})},
        moveAll: function(){bacteria_list.forEach(function(b){b.move();})},
        getLength: function (){return bacteria_list.length;},
        reproduce: reproduce
    };
}();
