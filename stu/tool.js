let T = {

    requestAnimFrame: (() => window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    })(),

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
        drawRoundedRect(x, y, width, height, radius, context);
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

    reset({x = 0, y = 0, width = wid, height = hei, img = init[0]} = {}) {
        ctx.fillStyle = ctx.createPattern(img, 'repeat');
        ctx.fillRect(x, y, width, height);
    },

    getTouchendPosition(event) {

        let x = event.changedTouches[0].clientX;
        let y = event.changedTouches[0].clientY;

        return {x, y};
    }
};

export default T;
    


