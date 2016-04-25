'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var images = [],
    init = [],
    resule = 0,
    load = 0,
    ctx = cav.getContext('2d');

var x_l = Math.floor(wid / 6),
    y_l = Math.floor(hei * 2 / 5),
    wid_l = Math.floor(wid * 2 / 3),
    hei_l = Math.floor(hei / 25);

window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

function getTouchendPosition(event) {

    var x = event.changedTouches[0].clientX;
    var y = event.changedTouches[0].clientY;

    return { x: x, y: y };
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
                    ctx.drawImage(init[1], Math.floor(wid / 6 - 25), Math.floor(hei * 11 / 25 + 10));
                    ctx.drawImage(init[2], Math.floor(wid * 5 / 6 - 50), Math.floor(hei * 11 / 25 + 10));
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

    ctx.fillStyle = '#ffffff';
    fillRoundedRect(ctx, x_l, y_l, wid_l, hei_l, 5);

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
                load = (wid_l - 4) * loaded / num;
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
            ctx.fillStyle = 'hsla(' + this.hue + ',100%, 40%, 1)';
            fillRoundedRect(ctx, x_l + 2, y_l + 2, this.width, hei_l - 4, 5);
            var grad = ctx.createLinearGradient(x_l + 2, y_l + 2, x_l + wid_l - 4, y_l + hei_l - 4);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(1, 'rgba(0,0,0,0.5)');
            ctx.fillStyle = grad;
            fillRoundedRect(ctx, x_l + 2, y_l + 2, this.width, hei_l - 4, 5);
        }
    }]);

    return ProgressBar;
}();

var bar = new ProgressBar();

function loading() {
    bar.hue += 0.8;

    if (bar.width >= wid_l - 4) {
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
                ctx.translate(0, hei * 7 / 10);
                ctx.rotate(15 * Math.PI / 180);
                ctx.drawImage(images[1], 0, 0, wid / 4 + this.size, wid / 4 + this.size);
                ctx.restore();
                ctx.save();
                ctx.translate(wid / 15, hei * 45 / 64);
                ctx.rotate(-20 * Math.PI / 180);
                ctx.globalAlpha = 0.5;
                ctx.drawImage(images[1], 0, 0, wid / 7 + this.size / 2, wid / 7 + this.size / 2);
                ctx.globalAlpha = 1;
                ctx.restore();
            }
        }]);

        return Heart;
    }();

    var hea = new Heart();

    function animloop() {
        if (hea.loop) {
            reset({ x: 0, y: hei * 11 / 16, width: wid / 4, height: hei * 5 / 16 });
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
        console.log('tab');
        firstPage();
        cav.removeEventListener('touchend', coverHandler, false);
    }

    reset();
    ctx.drawImage(images[3], wid - hei / 742 * 400, 0, hei / 742 * 400, hei);
    ctx.save();
    ctx.translate(0, hei / 30);
    ctx.rotate(-30 * Math.PI / 180);
    ctx.drawImage(images[1], 0, 0, wid / 4, wid / 4);
    ctx.restore();
    ctx.save();
    ctx.translate(wid * 7 / 26, hei * 5 / 24);
    ctx.rotate(30 * Math.PI / 180);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(images[1], 0, 0, wid / 6, wid / 6);
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.drawImage(images[2], 0, 0, wid * 5 / 12, hei * 7 / 10);
    animloop();

    cav.addEventListener('touchend', coverHandler, false);
}

function firstPage() {

    reset();
}

window.onload = function () {

    var source = ['./img/bg_1.jpg', './img/heart.png', './img/main-title.png', './img/oba.png'];
    initialize(['./img/bg.jpg', './img/0.png', './img/100.png'], function () {
        loadImages(source, function () {
            loading();
        });
    });
};
