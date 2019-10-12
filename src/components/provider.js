import React from 'react';
const DEFAULT_STATE = {
    paused: true,
    lastTimeCheck: 0,
    t: 0,
    oneTimeDraw: true,
    needRedraw: true,
    stopOnImpact: false,
    curImpactCount: 0,
    lastImpactChanged: 0,
    showEnergy: false,
    box2Mass: 10000,
    box2MassUsed: 10000,
    ui: {
        width: 512,
        height: 512,
        bottomSpace: 20,
    }
};
const MainContext = React.createContext(DEFAULT_STATE);

export {
    DEFAULT_STATE,
    MainContext,
}