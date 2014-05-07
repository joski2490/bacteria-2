var environment = function() {

    var bacteria_list = [];

    function addBacteria(bacteria){
        bacteria_list.push(bacteria);
    }

    return {
        addBacteria: addBacteria
    };
}();
