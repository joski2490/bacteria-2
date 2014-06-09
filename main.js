console.log('loading');

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
    var perfs = [];
    var perf_granularity = 50;

    function renderLoop() {
        var current_bact_nb = environment.getLength();
        var time_interval = (Date.now() - last_time) / 1000;
        if(time_interval > 1){
            current_fps = Math.floor(frame_count / time_interval);
            last_time = Date.now();
            frame_count = 0;

            if(play_chkb.checked) {
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
            }
        }
        frame_count++;
        addStatLine("Current FPS = " + current_fps);

        stats.innerHTML = "";
        if(play_chkb.checked){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            environment.mainLoop(ctx);
        }

        addStatLine("Current bacteria nb : "+current_bact_nb);
        statsMeter.setAttribute("value", current_bact_nb);
        updateStat();

        perfs.forEach(function(p, i){
            addStatLine("Perfs["+(i*perf_granularity)+"-"+((i+1)*perf_granularity)+"]=" + Math.floor(p.medium_fps));
        });

        window.requestAnimationFrame(renderLoop);
    }

    window.requestAnimationFrame(renderLoop);
});
