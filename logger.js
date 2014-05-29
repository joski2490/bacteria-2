var logger = (function(enabledModules){

    const LEVEL_LOG=0;
    const LEVEL_WARN=1;
    const LEVEL_ERROR=2;

    function consoleLog(log, level){
        if(enabledModules.contains(module)){
            console.log(log);
        }
    }

    return {
        log: function(module, log){
            consoleLog(log, LEVEL_LOG);
        }
    };
})(['bact.region'])
