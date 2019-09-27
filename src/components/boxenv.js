import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";
import {sqrtCollideCalc, types} from "../util/timeCalc";

function Coords() {

    function processor(ctx, contextInfo) {
        const {t, calculated} = contextInfo.state;
        if (!calculated) return;
        const {width, height} = contextInfo.state.ui;
        function translateY(y) {
            return height - y;
        }
        function drawLine(x,y,x1,y1) {
            ctx.beginPath();
            ctx.moveTo(x, translateY(y));
            ctx.lineTo(x1, translateY(y1));
            ctx.stroke();
        }

        function drawGroundSqure(x, size, m) {
            const w = size/2;
            ctx.beginPath();
            ctx.rect(x-w, translateY(size), size, size);
            ctx.stroke();
            ctx.fillText(x.toFixed(1), x - w + 1, translateY(size)+15);
            ctx.fillText(m, x - w + 1, translateY(size)+w);
        }
        ctx.fillStyle = "#F00";
        ctx.strokeStyle = "#F00";
        drawLine(0,0, 0,height);
        drawLine(0,0, width,0);
        //ctx.fillRect(0, 0, 100, 50);


        
        //const calculated = sqrtCollideCalc(opt);
        ctx.fillText(`time=${(t).toFixed(1)} ${calculated.impacts.length}`, 10, 10);
        calculated.items.map(itm=>{
            if (itm.type === types.BLOCK) {
                drawGroundSqure(itm.x + itm.v*(t - (itm.baseTime || 0)), itm.size, itm.m);
            }
        });

        calculated.impacts.map((i,ind)=>{
            const showb = b=> {
                if(b.type === types.WALL) return 'WALL';
                const newx = b.x + (b.v*(i.tm + (i.spent || 0)-(b.baseTime||0)));
                return `m${b.m} x=${newx.toFixed(2)}(${b.x.toFixed(2)}->${b.v.toFixed(2)}) baseTime=${(b.baseTime|| 0).toFixed(2)}`
            };

            const res =  `${i.spent.toFixed(2).padStart(5)} ${i.tm.toFixed(2).padStart(5)} ${showb(i.b1)} ==> ${showb(i.b2)} `
            //ctx.fillText(res, 0, 25+(ind*30));
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
                //ctx.fillText('==>'+i.next.map(showb).filter(a=>a!=='WALL').join(','), 0, 40+(ind*30));
            }

        });

        //drawGroundSqure(10 + (t/10), 20);
        //drawGroundSqure(100, 40);
    }

    return (
        <MainContext.Consumer>{
            contextInfo=> {
                return <RunWorker processor={processor} contextInfo={contextInfo}/>
            }
        }</MainContext.Consumer>
    );
}

export default Coords;