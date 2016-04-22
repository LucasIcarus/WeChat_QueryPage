var images = [],
    ctx = cav.getContext('2d'),
    x_l = Math.floor(wid/6),
    y_l = Math.floor(hei*2/5),
    wid_l = Math.floor(wid*2/3),
    hei_l = Math.floor(hei/25);

var bgImg = document.createElement('img');
bgImg.src = './img/bg.jpg';

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

function roundedRect (context, x, y, width, height, radius) {
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
}

function fillRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    roundedRect(context, x, y, width, height, radius);
    ctx.fill();
}

function ProgressBar() {
    this.widths = 10;
    this.hue = 0;

    this.draw = function() {
        ctx.fillStyle = 'hsla('+this.hue+',100%, 40%, 1)';
        fillRoundedRect(ctx, x_l + 2, y_l + 2, this.widths, hei_l -4, 5);
        var grad = ctx.createLinearGradient(x_l + 2, y_l + 2, x_l + wid_l - 4, y_l + hei_l - 4);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = grad;
        fillRoundedRect(ctx, x_l + 2, y_l + 2, this.widths, hei_l -4, 5);
    }
}



function loadImages(source, callback) {
    var loaded = 0,
        num = source.length,
        bar = new ProgressBar(),
        max,i;

    function loading() {
        bar.hue += 0.8;
        bar.widths += 2;
        if(bar.widths < max) {
            bar.draw();
            requestAnimationFrame(loading);
        }
    }

    for (i = 0; i < num; i++) {
        images[i] = document.createElement('img');
        images[i].src = source[i];
        images[i].onload = function() {
            loaded++;
            max = ((wid_l - 4) * loaded / num);
            loading();
            if (loaded >= num) {
                window.setTimeout(callback, 500);
            }
        };
    }
}

function reset(num) {
    var bg_r = ctx.createPattern(images[num], 'repeat');
    ctx.fillStyle = bg_r;
    ctx.fillRect(0, 0, wid, hei);
}

function main() {
    console.log('11111');
    reset(0);
}

bgImg.onload = function() {
    var bg = ctx.createPattern(bgImg, 'repeat');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, wid, hei);

    ctx.fillStyle = '#ffffff';
    fillRoundedRect(ctx, x_l, y_l, wid_l, hei_l, 5);

    var zero = document.createElement('img'),
        hundred = document.createElement('img');
    zero.src = 'img/0.png';
    hundred.src = 'img/100.png';
    zero.onload = function() {
        ctx.drawImage(zero, Math.floor(wid/6 - 25), Math.floor(hei*11/25 + 10));
    };
    hundred.onload = function() {
        ctx.drawImage(hundred, Math.floor(wid*5/6 - 50), Math.floor(hei*11/25 + 10));
    };
};

window.onload = function() {
    var source = ['./img/bg_1.jpg','./img/1.jpg', './img/2.jpg', './img/3.jpg', './img/4-1.jpg', './img/4-2.jpg'];
    loadImages(source, main);
};




