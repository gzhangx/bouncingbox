import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";
import {sqrtCollideCalc, types} from "../util/timeCalc";

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
            ctx.beginPath();
            ctx.rect(x-w, translateY(size), size, size);
            ctx.stroke();
            ctx.fillText(x.toFixed(1), x, translateY(size));
        }
        ctx.fillStyle = "#F00";
        drawLine(0,0, 0,height);
        drawLine(0,0, width,0);
        //ctx.fillRect(0, 0, 100, 50);


        const items = [
            {type: types.WALL, x: 0, id: 'w1'},
            {type: types.BLOCK, x: 390, v: -1, size: 100, id:'b1', m: 1000000},
            {type: types.BLOCK, x: 200, v: 0, size: 50,id:'b2', m: 1},
        ];
        const curt = t/20;
        const opt = {tdelta: curt, count: 0};
        const calculated = sqrtCollideCalc(items, opt);
        ctx.fillText((curt).toFixed(1)+ " " + calculated.count, 100, 10);
        calculated.items.map(itm=>{
            if (itm.type === types.BLOCK) {
                drawGroundSqure(itm.x + itm.v*(curt - (itm.baseTime || 0)), itm.size);
            }
        });

        calculated.impacts.map((i,ind)=>{
            const showb = b=> {
                if(b.type === types.WALL) return 'WALL';
                const newx = b.x + (b.v*(i.tm + (i.spent || 0)-(b.baseTime||0)));
                return `m${b.m} x=${newx.toFixed(2)}(${b.x.toFixed(2)}->${b.v.toFixed(2)}) baseTime=${(b.baseTime|| 0).toFixed(2)}`
            };

            const res =  `${i.spent.toFixed(2).padStart(5)} ${i.tm.toFixed(2).padStart(5)} ${showb(i.b1)} ==> ${showb(i.b2)} `
            ctx.fillText(res, 0, 25+(ind*30));
            //console.log(res);
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
                ctx.fillText('==>'+i.next.map(showb).filter(a=>a!=='WALL').join(','), 0, 40+(ind*30));
            }

        });

        //drawGroundSqure(10 + (t/10), 20);
        //drawGroundSqure(100, 40);
    }

    return (
        <MainContext.Consumer>{
            (contextState)=> {
                return <RunWorker width={512} height={512} processor={processor} contextState={contextState}/>
            }
        }</MainContext.Consumer>
    );
}

export default Coords;