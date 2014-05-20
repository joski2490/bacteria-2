function createRegion(params){

    var values = [];

    function getValue(x, y, r){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity),
            result;

        if(values[i] === undefined || values[i][j] === undefined){
            result = 0;
        } else {
            result = Math.min(values[i][j], r);
            values[i][j] -= result;
        }

        return result;
    };

    function setValue(x, y, r){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity);
        if(values[i] === undefined){
            console.log('create ['+i+'][]');
            values[i] = [];
        }
        if(values[i][j] === undefined){
            console.log('set ['+i+']['+j+']');
            values[i][j] = r;
        } else {
            console.log('addto ['+i+']['+j+']');
            values[i][j] += r;
        }
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

    }

    return {
        getValue: getValue,
        setValue: setValue,
        drawValues: drawValues
    }
}
