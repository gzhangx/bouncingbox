import React from 'react';
import Coords from './boxenv';

import {MainContext, DEFAULT_STATE} from "./provider";
class MainPage extends React.Component {
    state = DEFAULT_STATE;

    pause = () => {
        this.setState({paused: !this.state.paused});
    };
    render() {
        return (
            <MainContext.Provider value={this.state}>
                <Coords/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <button onClick={this.pause}/>
            </MainContext.Provider>
        );
    }
}

export default MainPage;