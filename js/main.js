'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 公共变量和一些常量。
var X = {
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

var Color = {
    femaleBg: '#B2B1FB',
    maleBg: '#FCC1C2',
    op1: '#7493C9',
    op2: '#F376A2',
    dot: '#E0F8A9',
    rect: ''
};

var images = {
    init: [],
    img: []
},
    result = {},
    load = 0,
    ctx = cav.getContext('2d');

window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

// 工具函数集合
(function () {
    var T = {
        drawRoundedRect: function drawRoundedRect(x, y, width, height, radius, context) {
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
        fillRoundedRect: function fillRoundedRect(x, y, width, height) {
            var style = arguments.length <= 4 || arguments[4] === undefined ? "#ffffff" : arguments[4];
            var radius = arguments.length <= 5 || arguments[5] === undefined ? 5 : arguments[5];
            var context = arguments.length <= 6 || arguments[6] === undefined ? ctx : arguments[6];

            context.fillStyle = style;
            this.drawRoundedRect(x, y, width, height, radius, context);
            context.fill();
        },
        roundedRectDot: function roundedRectDot(x, y, width, height, rounded, color, radius, interval) {
            var context = arguments.length <= 8 || arguments[8] === undefined ? ctx : arguments[8];

            var n = (width - 2 * rounded) % interval / 2,
                m = (height - 2 * rounded) % interval / 2,
                o = x + width - rounded,
                p = x + width - radius,
                q = y + height - radius,
                r = y + height - rounded;
            context.save();
            context.beginPath();
            context.fillStyle = color;
            for (var i = n + x + rounded; i <= o; i += interval) {
                context.moveTo(i - radius, y + radius);
                context.arc(i, y + radius, radius, 0, 2 * Math.PI, false);
            }

            for (var _i = n + x + rounded; _i <= o; _i += interval) {
                context.moveTo(_i - radius, q);
                context.arc(_i, q, radius, 0, 2 * Math.PI, false);
            }
            for (var _i2 = m + y + rounded; _i2 <= r; _i2 += interval) {
                context.moveTo(x + radius, _i2 - radius);
                context.arc(x + radius, _i2, radius, 0, Math.PI * 2, false);
            }
            for (var _i3 = m + y + rounded; _i3 <= r; _i3 += interval) {
                context.moveTo(p, _i3 - radius);
                context.arc(p, _i3, radius, 0, Math.PI * 2, false);
            }
            context.closePath();
            context.fill();
            context.restore();
        },
        rollback: function rollback(style) {
            var context = arguments.length <= 1 || arguments[1] === undefined ? ctx : arguments[1];

            var r = X.H_3_100;
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
        reset: function reset() {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref$x = _ref.x;
            var x = _ref$x === undefined ? 0 : _ref$x;
            var _ref$y = _ref.y;
            var y = _ref$y === undefined ? 0 : _ref$y;
            var _ref$width = _ref.width;
            var width = _ref$width === undefined ? wid : _ref$width;
            var _ref$height = _ref.height;
            var height = _ref$height === undefined ? hei : _ref$height;
            var _ref$img = _ref.img;
            var img = _ref$img === undefined ? images.init[0] : _ref$img;

            ctx.fillStyle = ctx.createPattern(img, 'repeat');
            ctx.fillRect(x, y, width, height);
        },


        ApplicationLogic: {
            handleTouch: function handleTouch(event) {
                event.preventDefault();
                event.stopPropagation();

                this.dealTouch(event);
            },
            dealTouch: function dealTouch(event) {
                var p = this.getTouchendPosition(event);
                this.custom(p);
            },
            getTouchendPosition: function getTouchendPosition(event) {

                var x = event.changedTouches[0].clientX;
                var y = event.changedTouches[0].clientY;

                return { x: x, y: y };
            },
            custom: function custom(p) {},
            unbind: function unbind(object) {
                cav.removeEventListener('touchend', object.handler, false);
            }
        }
    };

    window.T = T || window.T;
})(window);

// 初始化回调链
function init(source, callback) {
    var n = 3;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = source.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2);

            var index = _step$value[0];
            var url = _step$value[1];

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
            };
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

function loadImages(source) {

    T.fillRoundedRect(X.W_6, X.H_2_5, X.W_2_3, X.H_25);

    var loaded = 0,
        num = source.length;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = source.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2);

            var index = _step2$value[0];
            var url = _step2$value[1];

            images.img[index] = new Image();
            images.img[index].src = url;
            images.img[index].onload = function () {
                loaded++;
                load = (X.W_2_3 - 4) * loaded / num;
            };
        }

        // 初始化loading条动画效果
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    loading();
}

// loading条对象
var bar = {
    hue: 0,
    width: 10,
    loop: true,
    draw: function draw() {
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
    var heart = {
        size: 0,
        loop: true,
        state: 0,
        draw: function draw() {
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
            T.reset({ x: 0, y: X.H_11_16, width: X.W_4, height: X.H_5_16 });

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

var Page = function () {
    function Page(arr) {
        var gender = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        _classCallCheck(this, Page);

        this.arr = arr;
        this.gender = gender;
        this.option = null;
        this.context = ctx;
    }

    _createClass(Page, [{
        key: 'draw',
        value: function draw(point) {

            if (!this.gender) {
                T.reset();
                T.rollback(Color.femaleBg);
                if (point && this.context.isPointInPath(point.x, point.y)) {
                    this.option = -1;
                }
            } else {
                T.reset({ img: images.img[0] });
                T.rollback(Color.maleBg);
                if (point && this.context.isPointInPath(point.x, point.y)) {
                    this.option = -1;
                }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.arr.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = _slicedToArray(_step3.value, 2);

                    var index = _step3$value[0];
                    var args = _step3$value[1];


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
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        // 通过工具对象隔离事件的应用逻辑

    }, {
        key: 'handler',
        value: function handler(event) {
            T.ApplicationLogic.handleTouch(event);
        }
    }]);

    return Page;
}();

// 页面函数


function firstPage() {

    var fir = new Page([{
        x: X.W_10,
        y: X.H_5_18,
        width: X.W_4_5,
        height: X.H_11_60,
        color: Color.op1,
        dot: true,
        txt: images.img[4]
    }, {
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

    var source = ['./img/bg_1.png', './img/heart.png', './img/main-title.png', './img/oba.png', './img/op1.png', './img/op2.png', './img/m_1_1.png', './img/m_1_2.png', './img/m_1_3.png', './img/m_1_4.png'];
    init(['./img/bg.jpg', './img/0.png', './img/100.png'], function () {
        loadImages(source);
    });
};
