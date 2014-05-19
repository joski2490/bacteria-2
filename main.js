console.log('loading');

window.addEventListener("load", function (event){
    var canvas = document.getElementById("main");
    var ctx = canvas.getContext('2d');
    var timer = Date.now();

    console.log('init');

    for(var i = 0; i< 10 ; i++){
        environment.addBacteria(generateBacteria());
    }

    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        environment.mainLoop(ctx);
        console.log('drawing ' + environment.getLength()+' bacteria');

        if(Date.now() - timer < 2e4){
            window.requestAnimationFrame(renderLoop);
        }
    }

    window.requestAnimationFrame(renderLoop);
});
