console.log('loading');

window.addEventListener("load", function (event){
    var canvas = document.getElementById("main");
    var play_chkb = document.getElementById("play");
    var ctx = canvas.getContext('2d');
    var timer = Date.now();
    var looping = false;

    console.log('init');

    for(var i = 0; i< 10 ; i++){
        environment.addBacteria(generateBacteria());
    }

    function renderLoop() {
        if(looping){
            console.log('throttling at ' + environment.getLength()+' bacteria');
        }
        if(play_chkb.checked){
            looping = true;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            environment.mainLoop(ctx);
            looping = false;
        }

        window.requestAnimationFrame(renderLoop);
    }

    window.requestAnimationFrame(renderLoop);
});
