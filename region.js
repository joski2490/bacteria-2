function createRegion(params){

    const MODULE_NAME = "bact.region";
    function log(message){
        logger.log(MODULE_NAME, message);
    }
    function debug(message){
        logger.debug(MODULE_NAME, message);
    }
    function warn(message){
        logger.debug(MODULE_NAME, message);
    }

    var values = [];
    var hovering = undefined;

    function logSpace(i,j){
        if(values[i] !== undefined && values[i][j] !== undefined && values[i][j].length>0){
            var str = values[i][j][0]._hash;
            for(var k=1; k<values[i][j].length ; k++){
                str += ";"+values[i][j][k]._hash;
            }
            log("values["+i+"]["+j+"]="+str);
        }
    }

    function popValue(x, y, qty){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity),
            result;

        if(values[i] === undefined || values[i][j] === undefined){
            if(typeof qty === "number"){
                result = 0;
            } else {
                result = undefined;
            }
        } else {
            if(typeof qty === "number"){
                result = Math.min(values[i][j], qty);
                values[i][j] -= result;
            } else {
                var obj_index;
                debug("poping values["+i+"]["+j+"] ("+values[i][j].length+") for "+qty._hash);
                if(values[i][j] !== undefined){
                    for(var k=0; k<values[i][j].length; k++){
                        if(values[i][j][k] === qty){
                            if(obj_index !== undefined){
                                warn("both values["+i+"]["+j+"]["+obj_index+"] and values["+i+"]["+j+"]["+k+"] has " + qty._hash);
                            }
                            obj_index = k;
                        }
                    }
                }
                if(obj_index !== undefined){
                    log("poping now ! "+values[i][j].length+" at "+obj_index);
                    result = values[i][j][obj_index];
                    values[i][j].splice(obj_index, 1);
                } else {
                    warn(qty._hash+" not poped")
                }
            }
        }

        return result;
    };

    function pushValue(x, y, qty){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity);
        if(values[i] === undefined){
            debug('create ['+i+'][]');
            values[i] = [];
        }

        if(typeof qty === "number"){
            if(values[i][j] === undefined){
                debug('set ['+i+']['+j+']');
                values[i][j] = qty;
            } else {
                debug('addto ['+i+']['+j+']');
                values[i][j] += qty;
            }
        } else {
            if(values[i][j] === undefined){
                debug('set ['+qty._hash+'] ['+i+']['+j+']');
                values[i][j] = [qty];
            } else {
                debug('addto ['+qty._hash+'] ['+i+']['+j+']');
                values[i][j].push(qty);
            }
        }
    };

    function getValue(x, y){
        var i = Math.floor(x/params.granularity),
            j = Math.floor(y/params.granularity),
            result;

        if(x === undefined){
            result = values;
        } else if(y === undefined){
            result = values[i];
        } else if(values[i] === undefined || values[i][j] === undefined){
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
            //debug('create ['+i+'][]');
            values[i] = [];
        }
        //debug('set '+qty+' ['+i+']['+j+']');
        values[i][j] = qty;
    };

    function drawValues(ctx){
        for(var i=0; i<values.length; i++){
            if(values[i] !== undefined){
                for(var j=0; j<values[i].length; j++){
                    if(values[i][j] !== undefined){
                        var value;
                        if(typeof values[i][j] === "number"){
                            value = values[i][j];
                        } else {
                            value = values[i][j].length;
                        }
                        var alpha = Math.min(value / params.max, 1);

                        ctx.fillStyle = "rgba(" + params.color.red + "," + params.color.green + "," + params.color.blue + "," + alpha + ")";
                        //debug('draw region with alpha : '+alpha);
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
