import React from 'react';
const DEFAULT_STATE = {
    paused: false,
    foo:'bar',
};
const MainContext = React.createContext(DEFAULT_STATE);

export {
    DEFAULT_STATE,
    MainContext,
}