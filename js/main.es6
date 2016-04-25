let images = [],
    init = [],
    resule = 0,
    load = 0,
    ctx = cav.getContext('2d');

const x_l = Math.floor(wid / 6),
    y_l = Math.floor(hei * 2 / 5),
    wid_l = Math.floor(wid * 2 / 3),
    hei_l = Math.floor(hei / 25);

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function getTouchendPosition(event){

    let x = event.changedTouches[0].clientX;
    let y = event.changedTouches[0].clientY;

    return {x, y};
}

function fillRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    
    if (width > 0) {
        context.moveTo(x + radius, y);
    } else {
        context.moveTo(x - radius, y);
    }
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    if (width > 0) {
        context.arcTo(x, y, x + width, y, radius);
    } else {
        context.arcTo(x, y, x - width, y, radius);
    }
    
    ctx.fill();
}

function reset({x = 0, y = 0, width = wid, height = hei, img = init[0]} = {}) {
    let bg_r = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = bg_r;
    ctx.fillRect(x, y, width, height);
}

function initialize (source, callback) {
    let n = 3;

    for (let [index, url] of source.entries()) {
        init[index] = new Image();
        init[index].src = url;
        init[index].onload = function () {
            n--;
            if (!n) {
                let bg = ctx.createPattern(init[0], 'repeat');
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, wid, hei);
                ctx.drawImage(init[1], Math.floor(wid/6 - 25), Math.floor(hei*11/25 + 10));
                ctx.drawImage(init[2], Math.floor(wid*5/6 - 50), Math.floor(hei*11/25 + 10));
                callback();
            }
        }
    }
}

function loadImages(source, callback) {

    ctx.fillStyle = '#ffffff';
    fillRoundedRect(ctx, x_l, y_l, wid_l, hei_l, 5);

    let loaded = 0,
        num = source.length;

    for (let [index, url] of source.entries()) {
        images[index] = new Image();
        images[index].src = url;
        images[index].onload = function () {
            loaded++;
            load = (wid_l - 4) * loaded / num;
        }
    }

    callback();
}

class ProgressBar {
    
    constructor() {
        this.hue = 0;
        this.width = 10;
        this.loop = true;
    }
    
    draw() {
        ctx.fillStyle = 'hsla('+this.hue+',100%, 40%, 1)';
        fillRoundedRect(ctx, x_l + 2, y_l + 2, this.width, hei_l - 4, 5);
        var grad = ctx.createLinearGradient(x_l + 2, y_l + 2, x_l + wid_l - 4, y_l + hei_l - 4);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = grad;
        fillRoundedRect(ctx, x_l + 2, y_l + 2, this.width, hei_l -4, 5);
    }
}

let bar = new ProgressBar();

function loading() {
    bar.hue += 0.8;

    if (bar.width >= wid_l - 4) {
        bar.loop = false;
        setTimeout(function() {
            cover();
        }, 300);
    }

    if(bar.width < load && bar.loop) {
        bar.width += 2;
        bar.draw();
        requestAnimationFrame(loading);
    } else if (bar.loop) {
        bar.draw();
        requestAnimationFrame(loading);
    }

}

function cover() {
    class Heart {

        constructor() {
            this.size = 0;
            this.loop = true;
            this.state = 0;
        }

        draw() {
            ctx.save();
            ctx.translate(0, hei*7/10);
            ctx.rotate(15*Math.PI/180);
            ctx.drawImage(images[1], 0, 0, wid/4 + this.size, wid/4 + this.size);
            ctx.restore();
            ctx.save();
            ctx.translate(wid/15, hei * 45/64);
            ctx.rotate(-20*Math.PI/180);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(images[1], 0, 0, wid/7 + this.size/2, wid / 7 + this.size/2);
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }

    var hea = new Heart();

    function animloop() {
        if (hea.loop) {
            reset({x: 0, y: hei*11/16, width: wid/4, height: hei*5/16});
            if (hea.state == 0 && hea.size > 10) {
                hea.state = 1;
            }
            if (hea.state == 1 && hea.size <= 0) {
                hea.state = 0;
            }
            if(hea.state == 1) {
                hea.size -= 0.5;
            } else if(hea.state == 0) {
                hea.size += 0.5;
            }
            hea.draw();
            requestAnimationFrame(animloop);
        }
    }

    function coverHandler(event) {
        event.preventDefault();
        hea.loop = false;
        console.log('tab');
        firstPage();
        cav.removeEventListener('touchend', coverHandler, false);
    }

    reset();
    ctx.drawImage(images[3], wid - hei/742*400, 0, hei/742*400, hei);
    ctx.save();
    ctx.translate(0, hei/30);
    ctx.rotate(-30*Math.PI/180);
    ctx.drawImage(images[1], 0, 0, wid/4, wid/4);
    ctx.restore();
    ctx.save();
    ctx.translate(wid*7/26, hei*5/24);
    ctx.rotate(30*Math.PI/180);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(images[1], 0, 0, wid/6, wid/6);
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.drawImage(images[2], 0, 0, wid*5/12, hei*7/10);
    animloop();

    cav.addEventListener('touchend', coverHandler, false);
}

function firstPage() {

    reset();
}

window.onload = function() {

    let source = ['./img/bg_1.jpg','./img/heart.png', './img/main-title.png', './img/oba.png'];
    initialize(['./img/bg.jpg', './img/0.png', './img/100.png'], function() {
        loadImages(source, function() {
            loading();
        });
    });
};
   
