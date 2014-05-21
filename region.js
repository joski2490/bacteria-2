function createRegion(params){

    var values = [];
    var hovering = undefined;

    function popValue(x, y, qty){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity),
            result;

        if(values[i] === undefined || values[i][j] === undefined){
            result = 0;
        } else {
            result = Math.min(values[i][j], qty);
            values[i][j] -= result;
        }

        return result;
    };

    function pushValue(x, y, qty){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity);
        if(values[i] === undefined){
            console.log('create ['+i+'][]');
            values[i] = [];
        }
        if(values[i][j] === undefined){
            console.log('set ['+i+']['+j+']');
            values[i][j] = qty;
        } else {
            console.log('addto ['+i+']['+j+']');
            values[i][j] += qty;
        }
    };

    function getValue(x, y){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity),
            result;

        if(values[i] === undefined || values[i][j] === undefined){
            result = 0;
        } else {
            result = values[i][j];
        }

        return result;
    };

    function setValue(x, y, qty){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity);
        if(values[i] === undefined){
            console.log('create ['+i+'][]');
            values[i] = [];
        }
        console.log('set ['+i+']['+j+']');
        values[i][j] = qty;
    };

    function drawValues(ctx){
        for(var i=0; i<values.length; i++){
            if(values[i] !== undefined){
                for(var j=0; j<values[i].length; j++){
                    if(values[i][j] !== undefined){
                        var alpha = Math.min(values[i][j] / params.max, 1);
                        ctx.fillStyle = "rgba(" + params.color.red + "," + params.color.green + "," + params.color.blue + "," + alpha + ")";
                        console.log('draw region with alpha : '+alpha);
                        ctx.fillRect(i*params.granularity, j*params.granularity, params.granularity, params.granularity);
                    }
                }
            }
        }
    };

    function hover(bact) {
        if(hovering !== undefined){
            hovering(bact);
        }
    }

    return {
        pop: popValue,
        push: pushValue,
        get: getValue,
        set: setValue,
        draw: drawValues,
        onhover: function(funct){hovering = funct;},
        hover: hover
    }
}
