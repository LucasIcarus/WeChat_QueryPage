
// 公共变量和一些常量。
const X = {
    W_4: Math.floor(wid / 4),
    W_6: Math.floor(wid / 6),
    W_7: Math.floor(wid / 7),
    W_10: Math.floor(wid / 10),
    W_15: Math.floor(wid / 15),
    W_2_3: Math.floor(wid * 2 / 3),
    W_4_5: Math.floor(wid * 4 / 5),
    W_5_6: Math.floor(wid * 5 / 6),
    W_7_26: Math.floor(wid * 7 / 26),
    W_5_12: Math.floor(wid * 5 / 12),
    W_7_100: Math.floor(wid * 7 / 100),
    W_43_50: Math.floor(wid * 43 / 50),

    H_2: Math.floor(hei / 2),
    H_6: Math.floor(hei / 6),
    H_25: Math.floor(hei / 25),
    H_2_5: Math.floor(hei * 2 / 5),
    H_4_9: Math.floor(hei * 4 / 9),
    H_5_9: Math.floor(hei * 5 / 9),
    H_7_10: Math.floor(hei * 7 / 10),
    H_11_16: Math.floor(hei * 11 / 16),
    H_5_16: Math.floor(hei * 5 / 16),
    H_5_18: Math.floor(hei * 5 / 18),
    H_5_24: Math.floor(hei * 5 / 24),
    H_11_25: Math.floor(hei * 11 / 25),
    H_7_36: Math.floor(hei * 7 / 36),
    H_24_36: Math.floor(hei * 24 / 36),
    H_11_60: Math.floor(hei * 11 / 60),
    H_45_64: Math.floor(hei * 45 / 64),
    H_7_90: Math.floor(hei * 7 / 90),
    H_3_100: Math.floor(hei * 3 / 100),
    H_200_371: Math.floor(hei * 200 / 371)
};

const Color = {
    femaleBg: '#B2B1FB',
    maleBg: '#FCC1C2',
    op1: '#7493C9',
    op2: '#F376A2',
    dot: '#E0F8A9',
    rect: ''
};

let images = {
    init: [],
    img: []
    },
    result = {},
    load = 0,
    ctx = cav.getContext('2d');

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

// 工具函数集合
(function () {
    let T = {
        
        drawRoundedRect(x, y, width, height, radius, context) {
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

            context.closePath();
        },

        fillRoundedRect(x, y, width, height, style = "#ffffff", radius = 5, context = ctx) {
            context.fillStyle = style;
            this.drawRoundedRect(x, y, width, height, radius, context);
            context.fill();
        },

        roundedRectDot(x, y, width, height, rounded, color, radius, interval, context = ctx) {
            const n = ((width - 2 * rounded) % interval) / 2,
                m = ((height - 2 * rounded) % interval) / 2,
                o = x + width - rounded,
                p = x + width - radius,
                q = y + height - radius,
                r = y + height - rounded;
            context.save();
            context.beginPath();
            context.fillStyle = color;
            for (let i = n + x + rounded; i <= o; i += interval) {
                context.moveTo(i - radius, y + radius);
                context.arc(i, y + radius, radius, 0, 2 * Math.PI, false);
            }

            for (let i = n + x + rounded; i <= o; i += interval) {
                context.moveTo(i - radius, q);
                context.arc(i, q, radius, 0, 2 * Math.PI, false);
            }
            for (let i = m + y + rounded; i <= r; i += interval) {
                context.moveTo(x + radius, i - radius);
                context.arc(x + radius, i, radius, 0, Math.PI * 2, false);
            }
            for (let i = m + y + rounded; i <= r; i += interval) {
                context.moveTo(p, i - radius);
                context.arc(p, i, radius, 0, Math.PI * 2, false);
            }
            context.closePath();
            context.fill();
            context.restore();
        },

        rollback(style, context = ctx) {
            let r = X.H_3_100;
            context.save();
            context.fillStyle = style;
            context.strokeStyle = style;
            context.lineWidth = 4;
            context.beginPath();

            context.moveTo(1.4 * r - 1, 2 * r + 1);
            context.lineTo(2 * r, 1.6 * r);
            context.moveTo(1.4 * r - 1, 2 * r - 1);
            context.lineTo(2 * r, 2.4 * r);
            context.moveTo(1.4 * r, 2 * r);
            context.lineTo(2.6 * r, 2 * r);

            context.moveTo(3 * r, 2 * r);
            context.arc(r * 2, r * 2, r, 0, 2 * Math.PI, false);
            context.closePath();
            context.stroke();
            context.restore();
        },

        reset({x = 0, y = 0, width = wid, height = hei, img = images.init[0]} = {}) {
            ctx.fillStyle = ctx.createPattern(img, 'repeat');
            ctx.fillRect(x, y, width, height);
        },
        
        ApplicationLogic: {
            handleTouch(event) {
                event.preventDefault();
                event.stopPropagation();
                
                this.dealTouch(event);
            },
            
            dealTouch(event) {
                let p = this.getTouchendPosition(event);
                this.custom(p);
            },
            
            getTouchendPosition(event) {

                let x = event.changedTouches[0].clientX;
                let y = event.changedTouches[0].clientY;

                return {x, y};
            },
            
            custom(p) {},
            
            unbind(object) {
                cav.removeEventListener('touchend', object.handler, false);
            }
        }
    };

    window.T = T || window.T;
    
})(window);

// 初始化回调链
function init(source, callback) {
    let n = 3;

    for (let [index, url] of source.entries()) {
        images.init[index] = new Image();
        images.init[index].src = url;
        images.init[index].onload = function () {
            n--;
            if (!n) {
                ctx.fillStyle = ctx.createPattern(images.init[0], 'repeat');
                ctx.fillRect(0, 0, wid, hei);
                ctx.drawImage(images.init[1], X.W_6 - 25, X.H_11_25 + 10);
                ctx.drawImage(images.init[2], X.W_5_6 - 50, X.H_11_25 + 10);

                //加载需要用到的所有图片
                callback();
            }
        }
    }
}

function loadImages(source) {

    T.fillRoundedRect(X.W_6, X.H_2_5, X.W_2_3, X.H_25);

    let loaded = 0,
        num = source.length;

    for (let [index, url] of source.entries()) {
        images.img[index] = new Image();
        images.img[index].src = url;
        images.img[index].onload = function () {
            loaded++;
            load = (X.W_2_3 - 4) * loaded / num;
        }
    }

    // 初始化loading条动画效果
    loading();
}

// loading条对象
let bar = {
    hue: 0,
    width: 10,
    loop: true,
    draw() {
        T.fillRoundedRect(X.W_6 + 2, X.H_2_5 + 2, this.width, X.H_25 - 4, 'hsla(' + this.hue + ',100%, 40%, 1)');
        var grad = ctx.createLinearGradient(X.W_6 + 2, X.H_2_5 + 2, X.W_6 + X.W_2_3 - 4, X.H_2_5 + X.H_25 - 4);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        T.fillRoundedRect(X.W_6 + 2, X.H_2_5 + 2, this.width, X.H_25 - 4, grad);
    }
};

function loading() {
    bar.hue += 0.8;

    // 动画完成(下载完成作为必要非充分条件)之后关闭动画循环，跳转到封面函数。
    if (bar.width >= X.W_2_3 - 4) {
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

    // 类似bar的动画对象
    let heart = {
        size: 0,
        loop: true,
        state: 0,
        draw() {
            ctx.save();
            ctx.translate(0, X.H_7_10);
            ctx.rotate(15 * Math.PI / 180);
            ctx.drawImage(images.img[1], 0, 0, X.W_4 + this.size, X.W_4 + this.size);
            ctx.restore();
            ctx.save();
            ctx.translate(X.W_15, X.H_45_64);
            ctx.rotate(-20 * Math.PI / 180);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(images.img[1], 0, 0, X.W_7 + this.size / 2, X.W_7 + this.size / 2);
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    };

    function animation() {
        if (heart.loop) {
            T.reset({x: 0, y: X.H_11_16, width: X.W_4, height: X.H_5_16});

            // 状态转换
            if (heart.state == 0 && heart.size > 10) {
                heart.state = 1;
            }
            if (heart.state == 1 && heart.size <= 0) {
                heart.state = 0;
            }

            if (heart.state == 1) {
                heart.size -= 0.5;
            } else if (heart.state == 0) {
                heart.size += 0.5;
            }
            heart.draw();
            requestAnimationFrame(animation);
        }
    }

    function coverHandler(event) {
        event.preventDefault();
        heart.loop = false;

        // 点击后跳转第一页函数
        firstPage();
        cav.removeEventListener('touchend', coverHandler, false);
    }

    T.reset();
    ctx.drawImage(images.img[3], wid - X.H_200_371, 0, X.H_200_371, hei);
    ctx.save();
    ctx.translate(0, hei / 30);
    ctx.rotate(-30 * Math.PI / 180);
    ctx.drawImage(images.img[1], 0, 0, X.W_4, X.W_4);
    ctx.restore();
    ctx.save();
    ctx.translate(X.W_7_26, X.H_5_24);
    ctx.rotate(30 * Math.PI / 180);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(images.img[1], 0, 0, X.W_6, X.W_6);
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.drawImage(images.img[2], 0, 0, X.W_5_12, X.H_7_10);
    animation();

    cav.addEventListener('touchend', coverHandler, false);
}

// 后续页面基类
class Page {

    constructor(arr,gender = 0) {
        this.arr = arr;
        this.gender = gender;
        this.option = null;
        this.context = ctx;
    }

    draw(point) {

        if (!this.gender) {
            T.reset();
            T.rollback(Color.femaleBg);
            if (point && this.context.isPointInPath(point.x, point.y)) {
                this.option = -1;
            }
        } else {
            T.reset({img: images.img[0]});
            T.rollback(Color.maleBg);
            if (point && this.context.isPointInPath(point.x, point.y)) {
                this.option = -1;
            }
        }
        
        for (let [index, args] of this.arr.entries()) {

            T.fillRoundedRect(args.x, args.y, args.width, args.height, args.color);

            if (point && this.context.isPointInPath(point.x, point.y)) {
                this.option = index;
            }

            if (args.dot) {
                T.roundedRectDot(args.x, args.y, args.width, args.height, 5, Color.dot, 2, 6);
            }

            // 添加图片化文字
            this.context.drawImage(args.txt, args.x, args.y, args.width, args.height);
        }
    }
    
    // 通过工具对象隔离事件的应用逻辑
    handler(event) {
        T.ApplicationLogic.handleTouch(event);
    }
}

// 页面函数
function firstPage() {

    let fir = new Page([
        {
            x: X.W_10,
            y: X.H_5_18,
            width: X.W_4_5,
            height: X.H_11_60,
            color: Color.op1,
            dot: true,
            txt: images.img[4]
        },
        {
            x: X.W_10,
            y: X.H_2,
            width: X.W_4_5,
            height: X.H_11_60,
            color: Color.op2,
            dot: true,
            txt: images.img[5]
        }]);

    fir.draw();
    
    // 触摸事件针对不同页面的定制部分
    T.ApplicationLogic.custom = function (p) {
        fir.draw(p);
        
        switch (fir.option) {
            case 1:
                window.result.gender = 'female';
                firstLadyPage();
                break;
            case 0:
                window.result.gender = 'male';
                firstManPage();
                break;
            case -1:
                cover();
                break;
            default:
                fir.option = null;
        }
        
        this.unbind(fir);
    };

    cav.addEventListener('touchend', fir.handler, false);
}

// function firstManPage() {
//
//     function handler(event) {
//         event.preventDefault();
//         let p = getTouchendPosition(event);
//         firMan.draw(p);
//
//         console.log(firMan.option);
//         // switch (firMan.option) {
//         //     case -1:
//         //         firstPage();
//         //         cav.removeEventListener('touchend', handler, false);
//         //         break;
//         //     case
//         // }
//     }
//
//     let firMan = new QueryPage([{x: X.W_7_100, y:X.H_7_36, width: X.W_43_50, height: X.H_6},
//             {x: X.W_7_100, y:X.H_4_9, width: X.W_43_50, height: X.H_7_90},
//             {x: X.W_7_100, y:X.H_5_9, width: X.W_43_50, height: X.H_7_90},
//             {x: X.W_7_100, y:X.H_24_36, width: X.W_43_50, height: X.H_7_90}],
//         ['#ffffff'], [images[6], images[7], images[8], images[9]], 1, 'dot', true, true);
//
//     firMan.draw();
//
//     cav.addEventListener('touchend', handler, false);
// };
//
//
//
// function firstLadyPage() {
//     reset();
// }


// 页面初始化
window.onload = function () {

    let source = ['./img/bg_1.png', './img/heart.png', './img/main-title.png', './img/oba.png',
         './img/op1.png','./img/op2.png', './img/m_1_1.png', './img/m_1_2.png', './img/m_1_3.png',
        './img/m_1_4.png',];
    init(['./img/bg.jpg', './img/0.png', './img/100.png'], function () {
        loadImages(source);
    });
};

