import {RunWorker} from "./graphworker";
import React from "react";

import {sqrtCollideCalc} from "../util/timeCalc";
const types = {
    WALL: 'wall',
    BLOCK: 'block',
};

function tcheck(b1, b2) {
    function toWall(b, wallX) {
        const {size, v, x} = b1;
        const t = (wallX-x- (size/2))*1.0/v;
        return t;
    }
    if (b1.type === types.WALL) {
        return toWall(b2, b1.x);
    }else if(b2.type === types.WALL) {
        return toWall(b1, b2.x);
    }else {
        const {size: size1, v: v1, x: x1} = b1;
        const {size: size2, v: v2, x: x2} = b1;

        const tm = (x1 - x2 - ((size1+size2)/2))/(v1-v2);
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
            if (
                (!minTime && tm > 0)
                || (minTime && minTime.tm > tm)
            ) {
                minTime = {
                    b1,
                    b2,
                    tm,
                }
            }
        }
    }
    return minTime;
}

function updateItems(items, t, imp) {
    return items.map(itm=> {
       if (itm.type === types.WALL) return itm;
       if (itm === imp.b1 || itm === imp.b2) {
           return {
               ...itm,
               v: -itm.v,
               x: itm.x + (itm.v * imp.tm),
               baseTime: (itm.baseTime || 0) + imp.tm,
           }
       }
       return itm;
    });
}

function sqrtCollideCalc1(items, t, tdelta) {
    if (tdelta <= 0)  return items;
    const imp = findFirstImpact(items);
    if (!imp) return items;
    if (imp.tm < tdelta) {
        const next = updateItems(items, t, imp);
        return sqrtCollideCalc(next, t, tdelta - imp.tm);
    }
    return items;
}

function Coords() {

    function processor(ctx, props) {
        const {t, width, height} = props;

        function translateY(y) {
            return height - y;
        }
        function drawLine(x,y,x1,y1) {
            ctx.beginPath();
            ctx.moveTo(x, translateY(y));
            ctx.lineTo(x1, translateY(y1));
            ctx.stroke();
        }

        function drawGroundSqure(x, size) {
            const w = size/2;
            ctx.fillRect(x-w, translateY(w), w, w);
        }
        ctx.fillStyle = "#F00";
        drawLine(0,0, 0,height);
        drawLine(0,0, width,0);
        ctx.fillRect(0, 0, 100, 50);
        ctx.fillText((t / 1000).toFixed(1), 100, 10);

        const items = [
            {type: types.WALL, x: 0, id: 'w1'},
            {type: types.BLOCK, x: 100, v: -1, size: 100, id:'b1'},
            {type: types.BLOCK, x: 10, v: 1, size: 10,id:'b2'},
        ];
        const curt = t/10;
        const calculated = sqrtCollideCalc(items, 0, curt);
        calculated.map(itm=>{
            if (itm.type === types.BLOCK) {
                drawGroundSqure(itm.x + itm.v*(curt - (itm.baseTime || 0)), itm.size);
            }
        });

        //drawGroundSqure(10 + (t/10), 20);
        //drawGroundSqure(100, 40);
    }

    return (
        <RunWorker width={512} height={512} processor={processor}/>
    );
}

export default Coords;