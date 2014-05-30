var logger = (function(enabledModules){

    const LEVEL_DEBUG=0;
    const LEVEL_LOG=1;
    const LEVEL_WARN=2;
    const LEVEL_ERROR=3;

    function consoleLog(mod, log, level){
        var current_level = enabledModules[mod];
        //console.log("("+mod+";"+level+";"+current_level+") " + log);
        if(current_level !== undefined && level >= current_level){
            console.log("["+mod+"] "+log);
        }
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
        }
    };
})({
    'bact.region': 2,
    'bact.environnement': 2,
    'bact.bacteria': 1
})
