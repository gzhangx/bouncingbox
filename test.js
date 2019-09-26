const {types, sqrtCollideCalc} = require('./src/util/timeCalc');


const items = [
    {type: types.WALL, x: 0, id: 'w1'},
    {type: types.BLOCK, x: 100, v: -1, size: 100, id:'b1', m: 100},
    {type: types.BLOCK, x: 10, v: 1, size: 10,id:'b2', m: 1},
];
const curt = 49;
const calculated = sqrtCollideCalc(items, {tdelta: curt});
//console.log(calculated);
calculated.items.map(itm=>{
    if (itm.type === types.BLOCK) {
        console.log(`${itm.size} v=${itm.v.toFixed(2)} ${itm.x + itm.v*(curt - (itm.baseTime || 0))}`);
    }
});

console.log(calculated.impacts.map(i=>{
    const showb = b=> {
        if(b.type === types.WALL) return 'WALL';
        return ` m${b.m} x=${b.x.toFixed(2)} v=${b.v.toFixed(2)} baseTime=${(b.baseTime|| 0).toFixed(2)}`
    };

    return `${i.spent.toFixed(2).padStart(5)} ${i.tm.toFixed(2).padStart(5)} ${showb(i.b1)} ==> ${showb(i.b2)} `
}));