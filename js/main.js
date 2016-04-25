'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var W_4 = Math.floor(wid / 4),
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
var images = [],
    init = [],
    result = {},
    load = 0,
    ctx = cav.getContext('2d');

// 工具函数
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

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

function fillRoundedRect(x, y, width, height) {
    var style = arguments.length <= 4 || arguments[4] === undefined ? "#ffffff" : arguments[4];
    var radius = arguments.length <= 5 || arguments[5] === undefined ? 5 : arguments[5];
    var context = arguments.length <= 6 || arguments[6] === undefined ? ctx : arguments[6];

    context.fillStyle = style;
    drawRoundedRect(x, y, width, height, radius, context);
    context.fill();
}

function roundedRectDot(x, y, width, height, rounded, color, radius, interval) {
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
    context.fill();
    context.restore();
}

function reset() {
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
    var img = _ref$img === undefined ? init[0] : _ref$img;

    var bg_r = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = bg_r;
    ctx.fillRect(x, y, width, height);
}

function getTouchendPosition(event) {

    var x = event.changedTouches[0].clientX;
    var y = event.changedTouches[0].clientY;

    return { x: x, y: y };
}

// 初始化回调链
function initialize(source, callback) {
    var n = 3;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = source.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2);

            var index = _step$value[0];
            var url = _step$value[1];

            init[index] = new Image();
            init[index].src = url;
            init[index].onload = function () {
                n--;
                if (!n) {
                    var bg = ctx.createPattern(init[0], 'repeat');
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, wid, hei);
                    ctx.drawImage(init[1], W_6 - 25, H_11_25 + 10);
                    ctx.drawImage(init[2], W_5_6 - 50, H_11_25 + 10);
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

function loadImages(source, callback) {

    fillRoundedRect(W_6, H_2_5, W_2_3, H_25);

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

            images[index] = new Image();
            images[index].src = url;
            images[index].onload = function () {
                loaded++;
                load = (W_2_3 - 4) * loaded / num;
            };
        }
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

    callback();
}

var ProgressBar = function () {
    function ProgressBar() {
        _classCallCheck(this, ProgressBar);

        this.hue = 0;
        this.width = 10;
        this.loop = true;
    }

    _createClass(ProgressBar, [{
        key: 'draw',
        value: function draw() {

            fillRoundedRect(W_6 + 2, H_2_5 + 2, this.width, H_25 - 4, 'hsla(' + this.hue + ',100%, 40%, 1)');
            var grad = ctx.createLinearGradient(W_6 + 2, H_2_5 + 2, W_6 + W_2_3 - 4, H_2_5 + H_25 - 4);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(1, 'rgba(0,0,0,0.5)');
            fillRoundedRect(W_6 + 2, H_2_5 + 2, this.width, H_25 - 4, grad);
        }
    }]);

    return ProgressBar;
}();

var bar = new ProgressBar();

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
    var Heart = function () {
        function Heart() {
            _classCallCheck(this, Heart);

            this.size = 0;
            this.loop = true;
            this.state = 0;
        }

        _createClass(Heart, [{
            key: 'draw',
            value: function draw() {
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
        }]);

        return Heart;
    }();

    var hea = new Heart();

    function animloop() {
        if (hea.loop) {
            reset({ x: 0, y: H_11_16, width: W_4, height: H_5_16 });
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

var QueryPage = function () {
    function QueryPage(arr, style, source) {
        var statement = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

        _classCallCheck(this, QueryPage);

        this.arr = arr;
        this.style = style;
        this.source = source;
        this.option = null;
        this.context = ctx;
        this.statement = statement;
    }

    _createClass(QueryPage, [{
        key: 'draw',
        value: function draw(point) {
            reset();
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.arr.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = _slicedToArray(_step3.value, 2);

                    var index = _step3$value[0];
                    var arg = _step3$value[1];

                    fillRoundedRect(arg.x, arg.y, arg.width, arg.height, this.style[index]);
                    if (!this.statement || index > 0) {
                        if (point && this.context.isPointInPath(point.x, point.y)) {
                            this.option = index;
                        }
                    }
                    roundedRectDot(arg.x, arg.y, arg.width, arg.height, 5, '#E0F8A9', 2, 6);
                    this.context.drawImage(this.source[index], arg.x, arg.y, arg.width, arg.height);
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
    }]);

    return QueryPage;
}();

function firstPage() {

    function handler(event) {
        event.preventDefault();
        var p = getTouchendPosition(event);
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

    var fir = new QueryPage([{ x: W_10, y: H_5_18, width: W_4_5, height: H_11_60 }, { x: W_10, y: H_2, width: W_4_5, height: H_11_60 }], ['#7493C9', '#F376A2'], [images[4], images[5]]);
    fir.draw();

    cav.addEventListener('touchend', handler, false);
}

function firstManPage() {
    reset({ img: images[0] });
}

function firstLadyPage() {
    reset();
}

// 页面初始化
window.onload = function () {

    var source = ['./img/bg_1.png', './img/heart.png', './img/main-title.png', './img/oba.png', './img/1_1.png', './img/1_2.png'];
    initialize(['./img/bg.jpg', './img/0.png', './img/100.png'], function () {
        loadImages(source, function () {
            loading();
        });
    });
};
