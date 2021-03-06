require('babel-polyfill');

// 页面初始化
window.onload = function () {

    // 公共变量和一些常量。
    var wid = document.documentElement.clientWidth,
        hei = document.documentElement.clientHeight;
    var cav = document.getElementsByTagName('canvas')[0];
    cav.width = wid;
    cav.height = hei;

    window.cav = window.cav || cav;
    window.wid = window.wid || wid;
    window.hei = window.hei || hei;

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
        white: '#ffffff',
        stripe: '#fff79a',
        rect: ''
    };

    let images = {
            init: [],
            img: [],
            maleOp: [],
            femaleOp: [],
            maleResult: [],
            femaleResult: []
        },
        result = {
            gender: '',
            options: [],
            score: [],
            loadState: [0, 0]
        },
        load = 0,
        ctx = cav.getContext('2d');

    window.X = X || window.X;
    window.Color = Color || window.Color;
    window.images = images || window.images;
    window.result = result || window.result;
    window.load = load || window.load;
    window.ctx = ctx || window.ctx;

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

            randomSort(a, b) {
                return Math.random() - 0.5;
            },

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
                context.save();
                context.fillStyle = style;
                this.drawRoundedRect(x, y, width, height, radius, context);
                context.fill();
                context.restore();
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

            roundedRectStripe(x, y, width, height, rounded, color = Color.stripe, thick = 5, context = ctx) {
                if (9 * height > hei) {

                    // 大框条纹长度
                    var l = Math.floor((height - 2 * rounded) / 8.5),

                    // 纵向间隔
                        m = (height - rounded * 2 - l * 6) / 5;
                } else {

                    // 小框条纹长度
                    var l = Math.floor((height - 2 * rounded) / 4),
                        m = (height - rounded * 2 - l * 3) / 2;
                }

                // 横向前置余量
                const n = ((width - rounded * 2) % (l * 1.5)) / 2;

                context.save();
                context.fillStyle = color;

                for (let i = y + rounded; i < y + height - rounded; i += (m + l)) {
                    context.fillRect(x + 1, i, thick, l);
                    context.fillRect(x + width - thick - 1, i, thick, l);
                }

                for (let i = x + rounded + n; i < x + width - rounded - n; i += 1.5 * l) {
                    context.fillRect(i, y + 1, l, thick);
                    context.fillRect(i, y + height - thick - 1, l, thick);
                }


                context.restore();

            },

            rollback(style, context = ctx) {
                let r = X.H_3_100;
                context.save();
                context.fillStyle = style;
                context.strokeStyle = style;
                context.lineWidth = 5;
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

            reset({x = 0, y = 0, width = wid, height = hei, img = images.init[0]} = {}, context = ctx) {
                context.save();
                context.fillStyle = ctx.createPattern(img, 'repeat');
                context.fillRect(x, y, width, height);
                context.restore();
            },

            getRandomOption(arr = [{}]) {
                let r = [],
                    n = 0;

                for (let [index, args] of arr.entries()) {
                    if (args.option.random) {
                        r.push(arr[index].option);
                    }
                }

                if (r.length) {
                    r = r.sort(this.randomSort);
                }

                for (let [index, args] of arr.entries()) {
                    if (args.option.random) {
                        arr[index].option = r[n];
                        n++;
                    }
                }

                return arr;
            },

            getStandardArr(img, oddEven) {
                return [
                    {
                        x: X.W_7_100,
                        y: X.H_7_36,
                        width: X.W_43_50,
                        height: X.H_6,
                        color: Color.white,
                        dot: false,
                        stripe: true,
                        option: {
                            img: img,
                            random: false,
                            concat: true,
                            y: 0 + oddEven * 300,
                            height: 129
                        }
                    }, {
                        x: X.W_7_100,
                        y: X.H_4_9,
                        width: X.W_43_50,
                        height: X.H_7_90,
                        color: Color.white,
                        dot: false,
                        stripe: true,
                        option: {
                            img: img,
                            random: true,
                            score: 1,
                            mark: 'A',
                            concat: true,
                            y: 129 + oddEven * 300,
                            height: 57
                        }
                    }, {
                        x: X.W_7_100,
                        y: X.H_5_9,
                        width: X.W_43_50,
                        height: X.H_7_90,
                        color: Color.white,
                        dot: false,
                        stripe: true,
                        option: {
                            img: img,
                            random: true,
                            score: 2,
                            mark: 'B',
                            concat: true,
                            y: 186 + oddEven * 300,
                            height: 57
                        }
                    }, {
                        x: X.W_7_100,
                        y: X.H_24_36,
                        width: X.W_43_50,
                        height: X.H_7_90,
                        color: Color.white,
                        dot: false,
                        stripe: true,
                        option: {
                            img: img,
                            random: true,
                            score: 3,
                            mark: 'C',
                            concat: true,
                            y: 243 + oddEven * 300,
                            height: 57
                        }
                    }
                ];
            },

            touchEvent: {

                handleTouch(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    this.dealTouch(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                },

                dealTouch(x, y) {
                    let p = {x: x, y: y};
                    this.custom(p);
                },

                custom(p) {
                },

                unbind(object = Page.prototype) {
                    cav.removeEventListener('touchend', object.handler, false);
                }

            },

            lazyLoad(img, arr, gender, state) {
                let o = img.length,
                    loaded = 0;
                for (let [index, string] of arr.entries()) {
                    img[o + index] = new Image();
                    img[o + index].src = string;
                    img[o + index].onload = function () {
                        loaded++;
                        if (loaded >= arr.length) {
                            result.loadState[gender] = state;
                        }
                    };
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

        constructor(arr, gender = 0) {
            this.arr = T.getRandomOption(arr);
            this.gender = gender;
            this.option = null;
            this.context = ctx;
            this.draw();
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

                if (args.stripe) {
                    T.roundedRectStripe(args.x, args.y, args.width, args.height, 5);
                }

                // 添加图片化文字
                if (args.option.concat) {
                    this.context.drawImage(args.option.img, 0, args.option.y, 400, args.option.height, args.x, args.y, args.width,
                        args.height);
                } else {
                    this.context.drawImage(args.option.img, args.x, args.y, args.width, args.height);
                }
            }
        }

        // 通过工具对象隔离事件的应用逻辑
        handler(event) {
            T.touchEvent.handleTouch(event);
        }

        dealTouch(object, rollback, callback, index, gender) {

            return function (p) {
                object.draw(p);

                switch (object.option) {
                    case -1:
                        T.touchEvent.unbind();
                        rollback(gender);
                        break;
                    case 1:
                        T.touchEvent.unbind();
                        result.options[index] = object.arr[1].option.mark;
                        result.score[index] = object.arr[1].option.score;
                        callback(gender);
                        break;
                    case 2:
                        T.touchEvent.unbind();
                        result.options[index] = object.arr[2].option.mark;
                        result.score[index] = object.arr[2].option.score;
                        callback(gender);
                        break;
                    case 3:
                        T.touchEvent.unbind();
                        result.options[index] = object.arr[3].option.mark;
                        result.score[index] = object.arr[3].option.score;
                        callback(gender);
                        break;
                    default:
                        object.option = null;
                        break;
                }
            }
        }
    }

// 页面函数
    function firstPage() {

        result.gender = 'unknown';
        result.score = [];
        result.options = [];

        let fp = new Page([
            {
                x: X.W_10,
                y: X.H_5_18,
                width: X.W_4_5,
                height: X.H_11_60,
                color: Color.op1,
                dot: true,
                option: {
                    img: images.img[4],
                    random: false,
                    concat: false
                }
            }, {
                x: X.W_10,
                y: X.H_2,
                width: X.W_4_5,
                height: X.H_11_60,
                color: Color.op2,
                dot: true,
                option: {
                    img: images.img[5],
                    random: false,
                    concat: false
                }
            }], 0);

        // 触摸事件针对不同页面的定制部分
        T.touchEvent.custom = function (p) {
            fp.draw(p);

            switch (fp.option) {
                case 1:
                    this.unbind();
                    window.result.gender = 'female';
                    firstQueryPage(0);
                    break;
                case 0:
                    this.unbind();
                    window.result.gender = 'male';
                    firstQueryPage(1);
                    break;
                case -1:
                    this.unbind();
                    cover();
                    break;
                default:
                    fp.option = null;
            }

        };

        cav.addEventListener('touchend', Page.prototype.handler, false);
    }

    function firstQueryPage(gender) {

        let fir = null;

        if (!gender) {

            if (result.loadState[gender] === 0) {
                T.lazyLoad(images.femaleOp, ['./img/m-2.png', './img/m-3.png'], gender, 1);
            }

            fir = new Page(T.getStandardArr(images.img[6], 0), gender);
        } else {

            if (result.loadState[gender] === 0) {
                T.lazyLoad(images.maleOp, ['./img/n-2.png', './img/n-3.png'], gender, 1);
            }

            fir = new Page(T.getStandardArr(images.img[7], 0), gender);
        }

        T.touchEvent.custom = fir.dealTouch(fir, firstPage, secondQueryPage, 0, gender);

        cav.addEventListener('touchend', fir.handler, false);
    }

    function secondQueryPage(gender) {
        let sec = null;

        if (!gender) {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.femaleOp, ['./img/m-4.png', './img/m-5.png', './img/m-6.png'], gender, 2);
            }

            sec = new Page(T.getStandardArr(images.img[6], 1), gender);
        } else {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.maleOp, ['./img/n-4.png', './img/n-5.png', './img/n-6.png'], gender, 2);
            }

            sec = new Page(T.getStandardArr(images.img[7], 1), gender);
        }

        T.touchEvent.custom = sec.dealTouch(sec, firstQueryPage, thirdQueryPage, 1, gender);

        cav.addEventListener('touchend', sec.handler, false);
    }

    function thirdQueryPage(gender) {

        if (result.loadState[gender] === 0) {
            seventhQueryPage(gender);
            return;
        }

        let thi = null;

        if (!gender) {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.femaleOp, ['./img/m-4.png', './img/m-5.png', './img/m-6.png'], gender, 2);
            }

            thi = new Page(T.getStandardArr(images.femaleOp[0], 0), gender);
        } else {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.maleOp, ['./img/n-4.png', './img/n-5.png', './img/n-6.png'], gender, 2);
            }

            thi = new Page(T.getStandardArr(images.maleOp[0], 0), gender);
        }

        T.touchEvent.custom = thi.dealTouch(thi, secondQueryPage, fourthQueryPage, 2, gender);

        cav.addEventListener('touchend', thi.handler, false);
    }

    function fourthQueryPage(gender) {

        let fou = null;

        if (!gender) {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.femaleOp, ['./img/m-4.png', './img/m-5.png', './img/m-6.png'], gender, 2);
            }

            fou = new Page(T.getStandardArr(images.femaleOp[0], 1), gender);
        } else {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.maleOp, ['./img/n-4.png', './img/n-5.png', './img/n-6.png'], gender, 2);
            }

            fou = new Page(T.getStandardArr(images.maleOp[0], 1), gender);
        }

        T.touchEvent.custom = fou.dealTouch(fou, thirdQueryPage, fifthQueryPage, 3, gender);

        cav.addEventListener('touchend', fou.handler, false);
    }

    function fifthQueryPage(gender) {

        let fif = null;

        if (!gender) {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.femaleOp, ['./img/m-4.png', './img/m-5.png', './img/m-6.png'], gender, 2);
            }

            fif = new Page(T.getStandardArr(images.femaleOp[1], 0), gender);
        } else {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.maleOp, ['./img/n-4.png', './img/n-5.png', './img/n-6.png'], gender, 2);
            }

            fif = new Page(T.getStandardArr(images.maleOp[1], 0), gender);
        }

        T.touchEvent.custom = fif.dealTouch(fif, fourthQueryPage, sixthQueryPage, 4, gender);

        cav.addEventListener('touchend', fif.handler, false);
    }

    function sixthQueryPage(gender) {

        let six = null;

        if (!gender) {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.femaleOp, ['./img/m-4.png', './img/m-5.png', './img/m-6.png'], gender, 2);
            }

            six = new Page(T.getStandardArr(images.femaleOp[1], 1), gender);
        } else {

            if (result.loadState[gender] === 1) {
                T.lazyLoad(images.maleOp, ['./img/n-4.png', './img/n-5.png', './img/n-6.png'], gender, 2);
            }

            six = new Page(T.getStandardArr(images.maleOp[1], 1), gender);
        }

        T.touchEvent.custom = six.dealTouch(six, fifthQueryPage, seventhQueryPage, 5, gender);

        cav.addEventListener('touchend', six.handler, false);
    }

    function seventhQueryPage(gender) {

        if (result.loadState[gender] === 1) {
            sixthQueryPage(gender);
            return;
        }

        let sev = null;

        if (!gender) {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.femaleResult, ['./img/m-7.png', './img/m-8.png', './img/m-9.png'], gender, 3);
            }

            sev = new Page(T.getStandardArr(images.femaleOp[2], 0), gender);
        } else {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.maleResult, ['./img/n-7.png', './img/n-8.png', './img/n-9.png'], gender, 3);
            }
            sev = new Page(T.getStandardArr(images.maleOp[2], 0), gender);
        }


        T.touchEvent.custom = sev.dealTouch(sev, sixthQueryPage, eighthQueryPage, 6, gender);

        cav.addEventListener('touchend', sev.handler, false);
    }

    function eighthQueryPage(gender) {

        let eig = null;

        if (!gender) {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.femaleResult, ['./img/m-7.png', './img/m-8.png', './img/m-9.png'], gender, 3);
            }

            eig = new Page(T.getStandardArr(images.femaleOp[2], 1), gender);
        } else {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.maleResult, ['./img/n-7.png', './img/n-8.png', './img/n-9.png'], gender, 3);
            }
            eig = new Page(T.getStandardArr(images.maleOp[2], 1), gender);
        }

        T.touchEvent.custom = eig.dealTouch(eig, seventhQueryPage, ninthQueryPage, 7, gender);

        cav.addEventListener('touchend', eig.handler, false);
    }

    function ninthQueryPage(gender) {

        let nin = null;

        if (!gender) {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.femaleResult, ['./img/m-7.png', './img/m-8.png', './img/m-9.png'], gender, 3);
            }

            nin = new Page(T.getStandardArr(images.femaleOp[3], 0), gender);
        } else {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.maleResult, ['./img/n-7.png', './img/n-8.png', './img/n-9.png'], gender, 3);
            }
            nin = new Page(T.getStandardArr(images.maleOp[3], 0), gender);
        }

        T.touchEvent.custom = nin.dealTouch(nin, eighthQueryPage, tenthQueryPage, 8, gender);

        cav.addEventListener('touchend', nin.handler, false);
    }

    function tenthQueryPage(gender) {

        let ten = null;

        if (!gender) {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.femaleResult, ['./img/m-7.png', './img/m-8.png', './img/m-9.png'], gender, 3);
            }

            ten = new Page(T.getStandardArr(images.femaleOp[3], 1), gender);
        } else {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.maleResult, ['./img/n-7.png', './img/n-8.png', './img/n-9.png'], gender, 3);
            }
            ten = new Page(T.getStandardArr(images.maleOp[3], 1), gender);
        }

        T.touchEvent.custom = ten.dealTouch(ten, ninthQueryPage, eleventhQueryPage, 9, gender);

        cav.addEventListener('touchend', ten.handler, false);
    }

    function eleventhQueryPage(gender) {

        let ele = null;

        if (!gender) {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.femaleResult, ['./img/m-7.png', './img/m-8.png', './img/m-9.png'], gender, 3);
            }

            ele = new Page(T.getStandardArr(images.femaleOp[4], 0), gender);
        } else {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.maleResult, ['./img/n-7.png', './img/n-8.png', './img/n-9.png'], gender, 3);
            }
            ele = new Page(T.getStandardArr(images.maleOp[4], 0), gender);
        }

        T.touchEvent.custom = ele.dealTouch(ele, tenthQueryPage, lastQueryPage, 10, gender);

        cav.addEventListener('touchend', ele.handler, false);
    }

    function lastQueryPage(gender) {

        let last = null;

        if (!gender) {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.femaleResult, ['./img/m-7.png', './img/m-8.png', './img/m-9.png'], gender, 3);
            }

            last = new Page(T.getStandardArr(images.femaleOp[4], 1), gender);
        } else {

            if (result.loadState[gender] === 2) {
                T.lazyLoad(images.maleResult, ['./img/n-7.png', './img/n-8.png', './img/n-9.png'], gender, 3);
            }
            last = new Page(T.getStandardArr(images.maleOp[4], 1), gender);
        }

        T.touchEvent.custom = last.dealTouch(last, eleventhQueryPage, resultPage, 11, gender);

        cav.addEventListener('touchend', last.handler, false);
    }

    function resultPage(gender) {

        let n = Math.floor(Math.random() * 3);

        if (gender) {
            T.reset({img: images.img[0]});
            ctx.drawImage(images.maleResult[n], 0, 0, wid, hei);
        } else {
            T.reset();
            ctx.drawImage(images.femaleResult[n], 0, 0, wid, hei);
        }
    }


    let source = [
        './img/bg_1.png', './img/heart.png', './img/main-title.png', './img/oba.png', './img/op1.png','./img/op2.png',
        './img/m-1.png', './img/n-1.png'
    ];
    
    
    init(['./img/bg.jpg', './img/0.png', './img/100.png'], function () {
        loadImages(source);
    });
};

