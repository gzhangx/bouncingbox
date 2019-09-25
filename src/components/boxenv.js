import {RunWorker} from "./graphworker";
import React from "react";

function Coords() {

    function processor(context, props) {
        const {rotation, t, width, height} = props;
        context.fillStyle = "#F00";
        context.fillRect(0, 0, 100, 50);
        context.fillText((t / 1000).toFixed(1), 100, 10);
    }

    return (
        <RunWorker width={512} height={512} processor={processor}/>
    );
}

export default Coords;