var logger = (function(enabledModules){

    const LEVEL_DEBUG=0;
    const LEVEL_LOG=1;
    const LEVEL_WARN=2;
    const LEVEL_ERROR=3;

    var perfs = [];
    var perf_granularity = 50;
    var max_perf = 1;

    function consoleLog(mod, log, level){
        var current_level = enabledModules[mod];
        //console.log("("+mod+";"+level+";"+current_level+") " + log);
        if(current_level !== undefined && level >= current_level){
            console.log("["+mod+"] "+log);
        }
    }

    function register_perfs(current_bact_nb, current_fps){
        var perf_index = Math.floor(current_bact_nb/perf_granularity);
        if(perfs[perf_index] === undefined){
            perfs[perf_index] = {
                medium_fps: current_fps,
                count: 1
            }
        } else {
            // b = (n*x + y) / (n+1) = x + (y-x)/(n+1)
            perfs[perf_index].count += 1;
            perfs[perf_index].medium_fps += (current_fps - perfs[perf_index].medium_fps) / perfs[perf_index].count;
        }
        max_perf = Math.max(max_perf, perfs[perf_index].medium_fps);
    }

    function output_perfs(){
        var str = "";
        perfs.forEach(function(p, i){
            str += "Perfs["+(i*perf_granularity)+"-"+((i+1)*perf_granularity)+"]=" + Math.floor(p.medium_fps) +"\n";
        });

        return str;
    }

    function output_graph(){
        var graph="  ^\n";
        for(var i=Math.ceil(max_perf); i>=0; i-=Math.ceil(max_perf/5)){
            var line;
            if(i >= 10){
                line = ""+i+"|";
            } else {
                line = " "+i+"|";
            }

            perfs.forEach(function(perf_value){
                if(perf_value.medium_fps <= i && perf_value.medium_fps > (i-Math.ceil(max_perf/5)) ) {
                    line +="*";
                }else{
                    line +=" ";
                }
            });
            graph += line + "\n";
        }
        graph += "  +";
        perfs.forEach(function(){
            graph += "-";
        });
        graph += ">\n";

        return graph;
    }

    return {
        debug: function(mod, log){
            consoleLog(mod, log, LEVEL_DEBUG);
        },
        log: function(mod, log){
            consoleLog(mod, log, LEVEL_LOG);
        },
        warn: function(mod, log){
            consoleLog(mod, log, LEVEL_WARN);
        },
        register_perfs: register_perfs,
        output_perfs: output_perfs,
        output_graph: output_graph
    };
})({
    'bact.region': 2,
    'bact.environnement': 2,
    'bact.bacteria': 2
})
