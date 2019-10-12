import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";

function EnergyEnv() {

    function processor(ctx, contextInfo) {
        const {t, needRedraw, calculated, origItems, showEnergy, currentItemStatus} = contextInfo.state;
        if (!calculated || !currentItemStatus) return;
        if (!needRedraw) {
            return;
        }

        if (!ctx)return true;
        const {width, height, bottomSpace} = contextInfo.state.ui;
        let scale = (width/2)-50;
        if (scale < 0) scale = 10;
        const mvMvCenter = {
            x: width/2,
            y: height/2,
            scale,
        };

        function translateY(y) {
            return height - y - bottomSpace;
        }
        function drawLine(x,y,x1,y1) {
            ctx.beginPath();
            ctx.moveTo(x, translateY(y));
            ctx.lineTo(x1, translateY(y1));
            ctx.stroke();
        }

        ctx.fillStyle = "#F00";
        ctx.strokeStyle = "#F00";

        if (showEnergy) {
            const iblk1 = origItems.find(i => i.id === 'b1');
            const r = Math.sqrt(iblk1.m) * iblk1.v;
            const scale = Math.abs(mvMvCenter.scale / r);
            ctx.beginPath();
            ctx.arc(mvMvCenter.x, translateY(mvMvCenter.y), mvMvCenter.scale, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(mvMvCenter.x - mvMvCenter.scale, translateY(mvMvCenter.y), 3, 0, 2 * Math.PI);
            ctx.fill();
            drawLine(mvMvCenter.x - mvMvCenter.scale, mvMvCenter.y, mvMvCenter.x + mvMvCenter.scale, mvMvCenter.y);
            //ctx.fill();
            calculated.impacts.reduce((acc, i) => {
                if ((i.spent + i.tm) >= t) return;
                const nb0 = i.next.find(it => it.id === 'b1') || acc.b0;
                const nb1 = i.next.find(it => it.id === 'b2') || acc.b1;
                const x1 = Math.sqrt(nb0.m) * nb0.v;
                const y1 = Math.sqrt(nb1.m) * nb1.v;

                const x0 = Math.sqrt(acc.b0.m) * acc.b0.v;
                const y0 = Math.sqrt(acc.b1.m) * acc.b1.v;
                drawLine(x0 * scale + mvMvCenter.x, y0 * scale + mvMvCenter.y, x1 * scale + mvMvCenter.x, y1 * scale + mvMvCenter.y);
                return {
                    b0: nb0,
                    b1: nb1,
                }
            }, {
                b0: iblk1,
                b1: origItems.find(i => i.id === 'b2'),
            });
        }
    }

    return (
        <MainContext.Consumer>{
            contextInfo=> {
                return <RunWorker processor={processor} contextInfo={contextInfo}/>
            }
        }</MainContext.Consumer>
    );
}

export default EnergyEnv;