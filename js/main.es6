const W_4 = Math.floor(wid / 4),
    W_6 = Math.floor(wid / 6),
    W_7 = Math.floor(wid / 7),
    W_10 = Math.floor(wid / 10),
    W_15 = Math.floor(wid / 15),
    W_2_3 = Math.floor(wid * 2 / 3),
    W_4_5 = Math.floor(wid * 4 / 5),
    W_5_6 = Math.floor(wid * 5 / 6),
    W_7_26 = Math.floor(wid * 7 / 26),
    W_5_12 = Math.floor(wid * 5 / 12),

    H_2 = Math.floor(hei / 2),
    H_25 = Math.floor(hei / 25),
    H_2_5 = Math.floor(hei * 2 / 5),
    H_7_10 = Math.floor(hei * 7 / 10),
    H_11_16 = Math.floor(hei * 11 / 16),
    H_5_16 = Math.floor(hei * 5 / 16),
    H_5_18 = Math.floor(hei * 5 / 18),
    H_5_24 = Math.floor(hei * 5 / 24),
    H_11_25 = Math.floor(hei * 11 / 25),
    H_11_60 = Math.floor(hei * 11 / 60),
    H_45_64 = Math.floor(hei * 45 / 64),
    H_200_371 = Math.floor(hei * 200 / 371);

// 公共变量和一些常量。
let images = [],
    init = [],
    result = {},
    load = 0,
    ctx = cav.getContext('2d');

// 工具函数
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function drawRoundedRect(x, y, width, height, radius, context) {

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
}

function fillRoundedRect(x, y, width, height, style = "#ffffff", radius = 5, context = ctx) {
    context.fillStyle = style;
    drawRoundedRect(x, y, width, height, radius, context);
    context.fill();
}

function roundedRectDot(x, y, width, height, rounded, color, radius, interval, context = ctx) {
    const n = ((width - 2 * rounded) % interval)/2,
        m = ((height - 2 * rounded) % interval)/2,
        o = x + width - rounded,
        p = x + width - radius,
        q = y + height - radius,
        r = y + height - rounded;
    context.save();
    context.beginPath();
    context.fillStyle = color;
    for(let i = n + x + rounded; i <= o; i += interval) {
        context.moveTo(i - radius, y + radius);
        context.arc(i, y + radius, radius, 0, 2 * Math.PI, false);
    }
    
    for(let i = n + x + rounded; i <= o; i += interval) {
        context.moveTo(i - radius, q);
        context.arc(i, q, radius, 0, 2 * Math.PI, false);
    }
    for(let i = m + y + rounded; i <= r; i += interval) {
        context.moveTo(x + radius, i - radius);
        context.arc(x + radius, i, radius, 0, Math.PI * 2, false);
    }
    for (let i = m + y + rounded; i <= r; i += interval) {
        context.moveTo(p, i - radius);
        context.arc(p, i, radius, 0, Math.PI * 2, false);
    }
    context.fill();
    context.restore();
}

function reset({x = 0, y = 0, width = wid, height = hei, img = init[0]} = {}) {
    let bg_r = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = bg_r;
    ctx.fillRect(x, y, width, height);
}

function getTouchendPosition(event) {

    let x = event.changedTouches[0].clientX;
    let y = event.changedTouches[0].clientY;

    return {x, y};
}


// 初始化回调链
function initialize(source, callback) {
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
                ctx.drawImage(init[1], W_6 - 25, H_11_25 + 10);
                ctx.drawImage(init[2], W_5_6 - 50, H_11_25 + 10);
                callback();
            }
        }
    }
}

function loadImages(source, callback) {

    fillRoundedRect(W_6, H_2_5, W_2_3, H_25);

    let loaded = 0,
        num = source.length;

    for (let [index, url] of source.entries()) {
        images[index] = new Image();
        images[index].src = url;
        images[index].onload = function () {
            loaded++;
            load = (W_2_3 - 4) * loaded / num;
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

        fillRoundedRect(W_6 + 2, H_2_5 + 2, this.width, H_25 - 4, 'hsla(' + this.hue + ',100%, 40%, 1)');
        var grad = ctx.createLinearGradient(W_6 + 2, H_2_5 + 2, W_6 + W_2_3 - 4, H_2_5 + H_25 - 4);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        fillRoundedRect(W_6 + 2, H_2_5 + 2, this.width, H_25 - 4, grad);
    }
}

let bar = new ProgressBar();

function loading() {
    bar.hue += 0.8;

    if (bar.width >= W_2_3 - 4) {
        bar.loop = false;
        setTimeout(function () {
            cover();
        }, 300);
    }

    if (bar.width < load && bar.loop) {
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
            ctx.translate(0, H_7_10);
            ctx.rotate(15 * Math.PI / 180);
            ctx.drawImage(images[1], 0, 0, W_4 + this.size, W_4 + this.size);
            ctx.restore();
            ctx.save();
            ctx.translate(W_15, H_45_64);
            ctx.rotate(-20 * Math.PI / 180);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(images[1], 0, 0, W_7 + this.size / 2, W_7 + this.size / 2);
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }

    var hea = new Heart();

    function animloop() {
        if (hea.loop) {
            reset({x: 0, y: H_11_16, width: W_4, height: H_5_16});
            if (hea.state == 0 && hea.size > 10) {
                hea.state = 1;
            }
            if (hea.state == 1 && hea.size <= 0) {
                hea.state = 0;
            }
            if (hea.state == 1) {
                hea.size -= 0.5;
            } else if (hea.state == 0) {
                hea.size += 0.5;
            }
            hea.draw();
            requestAnimationFrame(animloop);
        }
    }

    function coverHandler(event) {
        event.preventDefault();
        hea.loop = false;
        firstPage();
        cav.removeEventListener('touchend', coverHandler, false);
    }

    reset();
    ctx.drawImage(images[3], wid - H_200_371, 0, H_200_371, hei);
    ctx.save();
    ctx.translate(0, hei / 30);
    ctx.rotate(-30 * Math.PI / 180);
    ctx.drawImage(images[1], 0, 0, W_4, W_4);
    ctx.restore();
    ctx.save();
    ctx.translate(W_7_26, H_5_24);
    ctx.rotate(30 * Math.PI / 180);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(images[1], 0, 0, W_6, W_6);
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.drawImage(images[2], 0, 0, W_5_12, H_7_10);
    animloop();

    cav.addEventListener('touchend', coverHandler, false);
}

// 问卷选择页面。

class QueryPage {
    constructor(arr, style, source, statement = false) {
        this.arr = arr;
        this.style = style;
        this.source = source;
        this.option = null;
        this.context = ctx;
        this.statement = statement;
    }

    draw(point) {
        for (let [index, arg] of this.arr.entries()) {
            fillRoundedRect(arg.x, arg.y, arg.width, arg.height, this.style[index]);
            if (!this.statement || index > 0) {
                if (point && this.context.isPointInPath(point.x, point.y)) {
                    this.option = index;
                }
            }
            roundedRectDot(arg.x, arg.y, arg.width, arg.height, 5, '#E0F8A9', 2, 6);
            this.context.drawImage(this.source[index], arg.x, arg.y, arg.width, arg.height);
        }
    }
}

function firstPage() {

    function handler(event) {
        event.preventDefault();
        let p = getTouchendPosition(event);
        fir.draw(p);
        switch (fir.option) {
            case 1:
                window.result.gender = 'female';
                firstLadyPage();
                cav.removeEventListener('touchend', handler, false);
                break;
            case 0:
                window.result.gender = 'male';
                firstManPage();
                cav.removeEventListener('touchend', handler, false);
                break;
            default:
                fir.option = null;
        }
    }

    let fir = new QueryPage([{x: W_10, y: H_5_18, width: W_4_5, height: H_11_60},
            {x: W_10, y: H_2, width: W_4_5, height: H_11_60}], ['#7493C9', '#F376A2'],
            [images[4],images[5]]);

    reset();
    fir.draw();

    cav.addEventListener('touchend', handler, false);
}

function firstManPage() {
    reset({img: images[0]});
}

function firstLadyPage() {
    reset();
}





// 页面初始化
window.onload = function () {

    let source = ['./img/bg_1.png', './img/heart.png', './img/main-title.png', './img/oba.png',
            './img/1_1.png', './img/1_2.png'];
    initialize(['./img/bg.jpg', './img/0.png', './img/100.png'], function () {
        loadImages(source, function () {
            loading();
        });
    });
};
   
