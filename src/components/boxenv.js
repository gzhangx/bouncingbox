import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";
import {types} from "../util/timeCalc";

function Coords() {

    function processor(ctx, contextInfo) {
        const {t, calculated, currentItemStatus, lastImpactChanged} = contextInfo.state;
        if (!calculated || !currentItemStatus) return;
        const {width, height, bottomSpace} = contextInfo.state.ui;
        function translateY(y) {
            return height - y - bottomSpace;
        }
        function drawLine(x,y,x1,y1) {
            ctx.beginPath();
            ctx.moveTo(x, translateY(y));
            ctx.lineTo(x1, translateY(y1));
            ctx.stroke();
        }

        function drawGroundSqure(x, size, m, v) {
            const w = size/2;
            ctx.beginPath();
            ctx.rect(x-w, translateY(size), size, size);
            ctx.stroke();
            ctx.fillText(x.toFixed(1), x - w + 1, translateY(5)+15);
            m = `m = ${m}`;
            const msize = ctx.measureText(m);
            const hsize = ctx.measureText('M');
            ctx.fillText(m, x - (msize.width/2), translateY(size) + w - 10);
            v = v.toFixed(2);
            const vsize = ctx.measureText(v);            
            ctx.fillText(v, x - (vsize.width/2), translateY(size)+ w + hsize.width + 5 );
            ctx.beginPath();
            ctx.arc(x, translateY(size) + w, 2, 0, 2*Math.PI);
            ctx.fill();
            drawLine(x, w,  x + (v*5), w);
            //ctx.restore();
        }
        ctx.fillStyle = "#F00";
        ctx.strokeStyle = "#F00";
        drawLine(0,0, 0,height);
        drawLine(0,0, width,0);
        //ctx.fillRect(0, 0, 100, 50);



        //const cItemsAll = generatePosByTime(calculated, origItems, t);
        const cItemsAll = currentItemStatus;
        const cItems = cItemsAll.imp;
        ctx.fillText(`time=${(t).toFixed(1)}`, 10, 10);
        const origFont = ctx.font;
        let fontSize = 20;
        if (cItemsAll.count > 0) {
            let blimpFact = 30 - (t - lastImpactChanged);
            if (blimpFact > 30) blimpFact = 30;
            if (blimpFact < 0) blimpFact = 0;
            fontSize += blimpFact;
        }
        ctx.font = `${fontSize}pt Calibri`;
        ctx.fillText(`${cItemsAll.count}`, 10, 60);
        ctx.font = origFont;
        cItems.map(itm=> drawGroundSqure(itm.x, itm.size, itm.m, itm.v));

        calculated.impacts.map((i,ind)=>{
            const showb = b=> {
                if(b.type === types.WALL) return 'WALL';
                const newx = b.x + (b.v*(i.tm + (i.spent || 0)-(b.baseTime||0)));
                return `m${b.m} x=${newx.toFixed(2)}(${b.x.toFixed(2)}->${b.v.toFixed(2)}) baseTime=${(b.baseTime|| 0).toFixed(2)}`
            };

            const res =  `${i.spent.toFixed(2).padStart(5)} ${i.tm.toFixed(2).padStart(5)} ${showb(i.blocks[0])} ==> ${showb(i.blocks[1])} `
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