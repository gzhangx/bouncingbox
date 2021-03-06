const {types, sqrtCollideCalc, generatePosByTime} = require('./src/util/timeCalc');


const items = [
    {type: types.WALL, x: 0, id: 'w1'},
    {type: types.BLOCK, x: 390, v: -1, size: 100, id:'b1', m: 10},
    {type: types.BLOCK, x: 200, v: 0, size: 50,id:'b2', m: 1},
];
const curt = 400;
const calculated = sqrtCollideCalc({items, t: curt});
//const calculated = sqrtCollideCalc(Object.assign({}, calculated1, {t: 400}));
//console.log(calculated);
calculated.items.map(itm=>{
    if (itm.type === types.BLOCK) {
        console.log(`${itm.size} v=${itm.v.toFixed(2)} ${itm.x + itm.v*(curt - (itm.baseTime || 0))}`);
    }
});


const temp = generatePosByTime(calculated, items, 200);
console.log(temp);

calculated.impacts.map(i=>{
    const showb = b=> {
        if(b.type === types.WALL) return 'WALL';
        const newx = b.x + (b.v*(i.tm + (i.spent || 0)-(b.baseTime||0)));
        return `m${b.m} x=${newx.toFixed(2)}(${b.x.toFixed(2)}->${b.v.toFixed(2)}) baseTime=${(b.baseTime|| 0).toFixed(2)}`
    };

    const res =  `${i.spent.toFixed(2).padStart(5)} ${i.tm.toFixed(2).padStart(5)} ${showb(i.blocks[0])} ==> ${showb(i.blocks[1])} `
    console.log(res);
    if (i.next) {
        const spent = i.next.reduce((acc, itm) => {
            if (itm.baseTime > acc) return itm.baseTime;
            return acc;
        }, 0);
        const shownxt = b => {
            if (b.type === types.WALL) return 'WALL';
            const newx = b.x + (b.v * (spent - (b.baseTime || 0)));
            return `m${b.m} x=${newx.toFixed(2)}(${b.x.toFixed(2)}->${b.v.toFixed(2)}) baseTime=${(b.baseTime || 0).toFixed(2)}`
        };
        console.log(i.next.map(showb).filter(a=>a!=='WALL'));
    }

});
