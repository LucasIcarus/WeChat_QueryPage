import T from './tool';

import {Color, images, init, result, load, ctx, X} from './var';

// 初始化回调链
function initialize(source, callback) {
    let n = 3;

    for (let [index, url] of source.entries()) {
        init[index] = new Image();
        init[index].src = url;
        init[index].onload = function () {
            n--;
            if (!n) {
                ctx.fillStyle = ctx.createPattern(init[0], 'repeat');
                ctx.fillRect(0, 0, wid, hei);
                ctx.drawImage(init[1], X.W_6 - 25, X.H_11_25 + 10);
                ctx.drawImage(init[2], X.W_5_6 - 50, X.H_11_25 + 10);
                callback();
            }
        }
    }
}

function loadImages(source, callback) {

    T.fillRoundedRect(X.W_6, X.H_2_5, X.W_2_3, X.H_25);

    let loaded = 0,
        num = source.length;

    for (let [index, url] of source.entries()) {
        images[index] = new Image();
        images[index].src = url;
        images[index].onload = function () {
            loaded++;
            load = (X.W_2_3 - 4) * loaded / num;
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

        T.fillRoundedRect(X.W_6 + 2, X.H_2_5 + 2, this.width, X.H_25 - 4, 'hsla(' + this.hue + ',100%, 40%, 1)');
        var grad = ctx.createLinearGradient(X.W_6 + 2, X.H_2_5 + 2, X.W_6 + X.W_2_3 - 4, X.H_2_5 + X.H_25 - 4);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        T.fillRoundedRect(X.W_6 + 2, X.H_2_5 + 2, this.width, X.H_25 - 4, grad);
    }
}

class Heart {

    constructor() {
        this.size = 0;
        this.loop = true;
        this.state = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(0, X.H_7_10);
        ctx.rotate(15 * Math.PI / 180);
        ctx.drawImage(images[1], 0, 0, X.W_4 + this.size, X.W_4 + this.size);
        ctx.restore();
        ctx.save();
        ctx.translate(X.W_15, X.H_45_64);
        ctx.rotate(-20 * Math.PI / 180);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(images[1], 0, 0, X.W_7 + this.size / 2, X.W_7 + this.size / 2);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

let bar = new ProgressBar();

function loading() {
    bar.hue += 0.8;

    if (bar.width >= X.W_2_3 - 4) {
        bar.loop = false;
        setTimeout(function () {
            cover();
        }, 300);
    }

    if (bar.width < load && bar.loop) {
        bar.width += 2;
        bar.draw();
        T.requestAnimationFrame(loading);
    } else if (bar.loop) {
        bar.draw();
        T.requestAnimationFrame(loading);
    }

}

function cover() {

    var hea = new Heart();

    function animloop() {
        if (hea.loop) {
            reset({x: 0, y: X.H_11_16, width: X.W_4, height: X.H_5_16});
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
    ctx.drawImage(images[3], wid - X.H_200_371, 0, X.H_200_371, hei);
    ctx.save();
    ctx.translate(0, hei / 30);
    ctx.rotate(-30 * Math.PI / 180);
    ctx.drawImage(images[1], 0, 0, X.W_4, X.W_4);
    ctx.restore();
    ctx.save();
    ctx.translate(X.W_7_26, X.H_5_24);
    ctx.rotate(30 * Math.PI / 180);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(images[1], 0, 0, X.W_6, X.W_6);
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.drawImage(images[2], 0, 0, X.W_5_12, X.H_7_10);
    animloop();

    cav.addEventListener('touchend', coverHandler, false);
}

// 问卷选择页面。
class QueryPage {
    constructor(arr, style = [''], source, gender = 0, decorate = 'dot', rollback = true, statement = false) {
        this.arr = arr;
        this.style = style;
        this.source = source;
        this.gender = gender;
        this.decorate = decorate;
        this.rollback = rollback;
        this.statement = statement;
        this.option = null;
        this.context = ctx;
    }

    draw(point) {

        if (!this.gender) {
            reset();
        } else {
            reset({img: images[0]});
        }

        // 绘制返回按钮
        if (this.rollback) {
            if (this.gender) {
                rollback(Color.maleBg);
            } else {
                rollback(Color.femaleBg);
            }
            if (point && this.context.isPointInPath(point.x, point.y)) {
                this.option = -1;
            }
        }

        for (let [index, arg] of this.arr.entries()) {

            // 绘制基本选项框以及陈述框
            if (this.style.length != 1) {
                fillRoundedRect(arg.x, arg.y, arg.width, arg.height, this.style[index]);
            } else {
                fillRoundedRect(arg.x, arg.y, arg.width, arg.height, this.style[0]);
            }

            // 利用重绘为选项框添编辑触摸击事件
            if (!this.statement || index > 0) {
                if (point && this.context.isPointInPath(point.x, point.y)) {
                    this.option = index;
                }
            }

            // 选项框装饰
            if(this.decorate == 'dot') {
                roundedRectDot(arg.x, arg.y, arg.width, arg.height, 5, Color.dot, 2, 6);
            } else if(this.decorate = 'rect') {

            }
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
            case -1:
                cover();
                cav.removeEventListener('touchend', handler, false);
                break;
            default:
                fir.option = null;
        }
    }

    let fir = new QueryPage([{x: X.W_10, y: X.H_5_18, width: X.W_4_5, height: X.H_11_60},
            {x: X.W_10, y: X.H_2, width: X.W_4_5, height: X.H_11_60}], [Color.op1, Color.op2],
        [images[4],images[5]]);

    fir.draw();

    cav.addEventListener('touchend', handler, false);
}

function firstManPage() {

    function handler(event) {
        event.preventDefault();
        let p = getTouchendPosition(event);
        firMan.draw(p);

        console.log(firMan.option);
        // switch (firMan.option) {
        //     case -1:
        //         firstPage();
        //         cav.removeEventListener('touchend', handler, false);
        //         break;
        //     case
        // }
    }

    let firMan = new QueryPage([{x: X.W_7_100, y:X.H_7_36, width: X.W_43_50, height: X.H_6},
            {x: X.W_7_100, y:X.H_4_9, width: X.W_43_50, height: X.H_7_90},
            {x: X.W_7_100, y:X.H_5_9, width: X.W_43_50, height: X.H_7_90},
            {x: X.W_7_100, y:X.H_24_36, width: X.W_43_50, height: X.H_7_90}],
        ['#ffffff'], [images[6], images[7], images[8], images[9]], 1, 'dot', true, true);

    firMan.draw();

    cav.addEventListener('touchend', handler, false);
};



function firstLadyPage() {
    reset();
}





// 页面初始化
window.onload = function () {

    let source = ['./img/bg_1.png', './img/heart.png', './img/main-title.png', './img/oba.png',
        './img/1_1.png', './img/1_2.png', './img/m_1_1.png', './img/m_1_2.png', './img/m_1_3.png',
        './img/m_1_4.png',];
    initialize(['./img/bg.jpg', './img/0.png', './img/100.png'], function () {
        loadImages(source, function () {
            loading();
        });
    });
};