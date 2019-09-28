import React from 'react';
const DEFAULT_STATE = {
    paused: false,
    lastTimeCheck: 0,
    t: 0,
    box2Mass: 10000,
    box2MassUsed: 10000,
    ui: {
        width: 512,
        height: 512,
    }
};
const MainContext = React.createContext(DEFAULT_STATE);

export {
    DEFAULT_STATE,
    MainContext,
}