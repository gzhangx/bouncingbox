const types = {
    WALL: 'wall',
    BLOCK: 'block',
};

function tcheck(b1, b2) {
    function toWall(b, wallX) {
        const {size, v, x} = b;
        const t = (wallX- x + (size/2))*1.0/v;
        return t;
    }

    if (b1.type === types.WALL) {
        return toWall(b2, b1.x);
    }
    if (b2.type === types.WALL) {
        return toWall(b1, b2.x);
    } else {
        const {size: size1, v: v1, x: x1} = b1;
        const {size: size2, v: v2, x: x2} = b2;

        const vdiff = (v2 - v1);
        if (vdiff === 0) return -99999;
        const tm = (x1 - x2 - ((size1 + size2) / 2)) / vdiff;
        return tm;
    }
}

function findFirstImpact(items) {
    let minTime = null;
    for (let i = 0; i < items.length; i++) {
        for (let j = i+1; j < items.length; j++) {
            const b1 = items[i];
            const b2 = items[j];
            const tm = tcheck(b1,b2);
            if (tm > 0) {
                if (!minTime || (minTime.tm > tm)) {
                    minTime = {
                        b1,
                        b2,
                        tm,
                    }
                }
            }
        }
    }
    return minTime;
}

function calcImpact(b1, b2) {
    const {m: m1, v: v1} = b1;
    const {m: m2, v: v2} = b2;

    const m1_2 = m1 - m2;
    const m12 = m1 + m2;
    const v1f = (m1_2 * v1 + 2 * m2 * v2) / m12;
    const v2f = ((-m1_2 * v2) + 2 * m1 * v1) / m12;
    return {
        v1: v1f,
        v2: v2f,
    }
}

function updateItems(items, t, imp) {
    return items.map(itm=> {
        if (itm.type === types.WALL) return itm;
        if (itm === imp.b1 || itm === imp.b2) {
            const res = calcImpact(imp.b1, imp.b2);
            return {
                ...itm,
                v: itm === imp.v1? res.v1:res.v2,//-itm.v,
                x: itm.x + (itm.v * imp.tm),
                baseTime: (itm.baseTime || 0) + imp.tm,
            }
        }
        return itm;
    });
}

function sqrtCollideCalc(items, t, tdelta) {
    if (tdelta <= 0)  return items;
    const imp = findFirstImpact(items);
    if (!imp) return items;
    if (imp.tm < tdelta) {
        const next = updateItems(items, t, imp);
        return sqrtCollideCalc(next, t, tdelta - imp.tm);
    }
    return items;
}

export {
    sqrtCollideCalc
};