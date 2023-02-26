console.log('loading');

if(Math.hypot === undefined){
    console.warn("Redefining Math.hypot");
    Math.hypot = function(){
        var result = 0;
        for(var i=0; i<arguments.length; i++){
            result += Math.pow(arguments[i], 2);
        }
        return Math.sqrt(result);
    };
}

window.addEventListener("load", function (event){
    var canvas = document.getElementById("main");
    var stats = document.getElementById("stats");
    var statsMeter = document.getElementById("statsMeter");
    var play_chkb = document.getElementById("play");
    var ctx = canvas.getContext('2d');
    var timer = Date.now();

    console.log('init');

    for(var i = 0; i< 10 ; i++){
        environment.addBacteria(generateBacteria());
    }

    var statsText = "";
    function addStatLine(text){
        statsText += text + "\n";
    }
    function updateStat(){
        stats.innerHTML = statsText;
        statsText = "";
    }

    var last_time = Date.now();
    var frame_count = 0;
    var current_fps;
    var max_perf_score = 0;

    function renderLoop() {
        var current_bact_nb = environment.getLength();
      //  var curSpec = [environment.specCount.red, environment.specCount.green, environment.specCount.blue];
        var time_interval = (Date.now() - last_time) / 1000;
        if(time_interval > 1){
            current_fps = Math.floor(frame_count / time_interval);
            last_time = Date.now();
            frame_count = 0;

            if(play_chkb.checked) {
                logger.register_perfs(current_bact_nb, current_fps);
                max_perf_score = Math.max(max_perf_score, current_fps * current_bact_nb);
            }
        }
        frame_count++;
        addStatLine("Current FPS = " + current_fps);
        addStatLine("Max perfs score = " + max_perf_score);
   /*     addStatLine("Spec 1 = " + curSpec[0]);
        addStatLine("Spec 2 = " + curSpec[1]);
        addStatLine("Spec 3 = " + curSpec[2]);
*/
        stats.innerHTML = "";
        if(play_chkb.checked){
            ctx.clearRect(0, 0, canvas.width*2, canvas.height*2);
            environment.mainLoop(ctx);
        }

        addStatLine("Current bacteria nb : "+current_bact_nb);
        statsMeter.setAttribute("value", current_bact_nb);
        updateStat();

        addStatLine(logger.output_graph());

        window.requestAnimationFrame(renderLoop);
    }

    window.requestAnimationFrame(renderLoop);
});
