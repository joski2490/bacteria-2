var environment = function() {

    var bacteria_list = [];

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
    };

    function clean(){
        var new_list = [];
        bacteria_list.forEach(function(b){
            if(!b.isDead()) {
                new_list.push(b);
            }
        });

        bacteria_list = new_list;
    }

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
        drawAll: function(ctx){bacteria_list.forEach(function(b){b.draw(ctx);})},
        moveAll: function(){bacteria_list.forEach(function(b){b.move();})},
        getLength: function (){return bacteria_list.length;},
        reproduceAll: reproduceAll,
        clean: clean
    };
}();
