import React from 'react';
const DEFAULT_STATE = {
    paused: false,
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