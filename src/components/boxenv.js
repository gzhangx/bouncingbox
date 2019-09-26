import {RunWorker} from "./graphworker";
import React from "react";

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
            ctx.fillRect(x-w, translateY(w), w, w);
        }
        ctx.fillStyle = "#F00";
        drawLine(0,0, 0,height);
        drawLine(0,0, width,0);
        ctx.fillRect(0, 0, 100, 50);


        const items = [
            {type: types.WALL, x: 0, id: 'w1'},
            {type: types.BLOCK, x: 390, v: -1, size: 100, id:'b1', m: 10},
            {type: types.BLOCK, x: 200, v: 1, size: 50,id:'b2', m: 1},
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

        //drawGroundSqure(10 + (t/10), 20);
        //drawGroundSqure(100, 40);
    }

    return (
        <RunWorker width={512} height={512} processor={processor}/>
    );
}

export default Coords;