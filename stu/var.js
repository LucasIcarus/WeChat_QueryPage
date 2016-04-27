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

let images = [],
    init = [],
    result = {},
    load = 0,
    ctx = cav.getContext('2d');

export {Color, images, init, result, load, ctx, X};