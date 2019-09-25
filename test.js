const types = {
    WALL: 'wall',
    BLOCK: 'block',
};

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
        const tm = (getX(b1) - getX(b2) - (Math.abs(size1 - size2) / 2)) / vdiff;
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
            if (tm >= 0) {
                if (!minTime || (minTime.tm > tm)) {
                    minTime = {
                        b1,
                        b2,
                        tm: tm === 0? 0.01:tm,
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

function updateItems(items, imp) {
    return items.map(itm=> {
        if (itm.type === types.WALL) return itm;
        if (itm === imp.b1 || itm === imp.b2) {
            const res = calcImpact(imp.b1, imp.b2);
            return {
                ...itm,
                v: itm === imp.b1? res.v1:res.v2,//-itm.v,
                x: itm.x + (itm.v * imp.tm),
                baseTime: (itm.baseTime || 0) + imp.tm,
            }
        }
        return itm;
    });
}

function sqrtCollideCalc(items, tdelta, spent = 0) {
    const timeLeft = tdelta - spent;
    if (timeLeft <= 0)  return items;
    const imp = findFirstImpact(items, spent);
    if (!imp) return items;
    if (imp.tm < timeLeft) {
        const next = updateItems(items, imp);
        return sqrtCollideCalc(next, tdelta, spent+imp.tm);
    }
    return items;
}



const items = [
    {type: types.WALL, x: 0, id: 'w1'},
    {type: types.BLOCK, x: 100, v: -1, size: 100, id:'b1', m: 100},
    {type: types.BLOCK, x: 10, v: 1, size: 10,id:'b2', m: 1},
];
const curt = 49;
const calculated = sqrtCollideCalc(items, curt);
console.log(calculated);
calculated.map(itm=>{
    if (itm.type === types.BLOCK) {
        console.log(`${itm.size} v=${itm.v.toFixed(2)} ${itm.x + itm.v*(curt - (itm.baseTime || 0))}`);
    }
});