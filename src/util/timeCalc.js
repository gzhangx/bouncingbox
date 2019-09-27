const types = {
    WALL: 'wall',
    BLOCK: 'block',
};

const MAGIC0 = 0.00000000001;
function tcheck(b1, b2, t) {
    function getX(b) {
        return b.x + ((t-(b.baseTime || 0))*b.v);
    }
    function toWall(b, wallX) {
        const {size, v} = b;
        const t = (wallX- getX(b) + (size/2))*1.0/v;
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
        const tm = (getX(b1) - getX(b2) - ((size1 + size2) / 2)) / vdiff;
        return tm;
    }
}

function findFirstImpact(items, spent) {
    let minTime = null;
    for (let i = 0; i < items.length; i++) {
        for (let j = i+1; j < items.length; j++) {
            const b1 = items[i];
            const b2 = items[j];
            const tm = tcheck(b1,b2, spent);
            if (tm > MAGIC0) {
                if (!minTime || (minTime.tm > tm)) {
                    minTime = {
                        b1,
                        b2,
                        tm,
                        spent,
                    }
                }
            }
        }
    }
    return minTime;
}

function calcImpact(b1, b2) {
    if (b1.type === types.WALL) {
        return {
            v2: -b2.v
        }
    }
    if (b2.type === types.WALL) {
        return {
            v1: -b1.v
        }
    }
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

function updateItems(items, imp, spent) {
    const res = calcImpact(imp.b1, imp.b2);
    return items.map(itm=> {
        if (itm.type === types.WALL) return itm;
        if (itm === imp.b1 || itm === imp.b2) {
            return Object.assign({}, itm, {
                v: itm === imp.b1? res.v1:res.v2,//-itm.v,
                x: itm.x + (itm.v * (imp.tm + spent - (itm.baseTime || 0))),
                baseTime: spent + imp.tm, //(itm.baseTime || 0) + imp.tm,
            });
        }
        return itm;
    });
}

function sqrtCollideCalc(opts) {
    const {tdelta, impacts = []} = opts;
    let {spent = 0, items} = opts;
    while(true) {
        const timeLeft = tdelta - spent;
        if (timeLeft <= 0) break;

        const imp = findFirstImpact(items, spent);
        if (!imp) break;

        if (imp.tm < timeLeft) {
            impacts.push(imp);
            const next = updateItems(items, imp, spent);
            imp.next = next;
            items = next;
            spent = spent + imp.tm;
            continue;
            //return sqrtCollideCalc(next, {tdelta, spent: spent + imp.tm, count: count + 1, impacts});
        }
        //return {
        //    impacts,
        //    items,
        //};
        break;
    }
    return Object.assign({}, opts, {spent, items, impacts});
}

exports.sqrtCollideCalc = sqrtCollideCalc;
exports.types = types;
