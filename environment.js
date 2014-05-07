var environment = function() {

    var bacteria_list = [];

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
    }

    function drawAll(ctx){
        for(var i=0; i<bacteria_list.length; i++){
            bacteria_list[i].draw(ctx);
        }
    }

    return {
        addBacteria: addBacteria,
        drawAll: drawAll,
        getLength: function (){return bacteria_list.length;}
    };
}();
