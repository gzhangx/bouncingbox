import React from 'react';
import Coords from './boxenv';

import {MainContext, DEFAULT_STATE} from "./provider";
class MainPage extends React.Component {
    state = DEFAULT_STATE;

    pause = () => {
        this.setState({paused: !this.state.paused});
    };
    reset = () => {
        this.setState({reset: true});
    };
    gsetState = (stat)=>{
        this.setState(stat);
    };
    back = () => {
        this.setState({back: !this.state.back});
    };
    forward = () => {
        this.setState({forward: !this.state.forward});
    };

    render() {
        return (
            <MainContext.Provider value={{state: this.state, setState: this.gsetState}}>
                <Coords/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <button onClick={this.pause}>Pause</button>
                <button onClick={this.back}>Back</button>
                <button onClick={this.forward}>Forward</button>
                <button onClick={this.reset}>Reset</button>
            </MainContext.Provider>
        );
    }
}

export default MainPage;