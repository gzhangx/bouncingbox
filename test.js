const {types, sqrtCollideCalc} = require('./src/util/timeCalc');


const items = [
    {type: types.WALL, x: 0, id: 'w1'},
    {type: types.BLOCK, x: 100, v: -1, size: 100, id:'b1', m: 100},
    {type: types.BLOCK, x: 10, v: 1, size: 10,id:'b2', m: 1},
];
const curt = 49;
const calculated = sqrtCollideCalc(items, {tdelta: curt});
console.log(calculated);
calculated.items.map(itm=>{
    if (itm.type === types.BLOCK) {
        console.log(`${itm.size} v=${itm.v.toFixed(2)} ${itm.x + itm.v*(curt - (itm.baseTime || 0))}`);
    }
});