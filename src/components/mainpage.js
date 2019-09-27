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

    processState = ()=>{
        let paused = false;
        const INC = 10;
        const contextInfo = this.state;        
        {
            const tickDiff = performance.now() - (this.state.t || 0) - this.state.startTime;
            if (contextInfo.paused) {
                paused = true;
                this.setState({startTime: this.state.startTime + tickDiff});
            }
            if (contextInfo.reset) {
                this.setState({startTime: performance.now()});
                this.setState({reset: false});
            }
            if (contextInfo.back) {
                paused = true;
                this.setState({startTime: this.state.startTime + tickDiff + INC, t: this.state.t - INC});
                this.setState({back: false, paused: true})
            }
            if (contextInfo.forward) {
                paused = true;
                this.setState({startTime: this.state.startTime + tickDiff - INC, t: this.state.t + INC});
                this.setState({forward: false, paused: true})
            }
        }

        if (!paused) {
            const tickDiff = performance.now() - this.state.startTime;
            this.setState({t: tickDiff});
        }
    };

    render() {
        return (
            <MainContext.Provider value={{state: this.state, setState: this.gsetState, processState: this.processState,}}>
                <Coords/>
                <button onClick={this.pause}>Pause</button>
                <button onClick={this.back}>Back</button>
                <button onClick={this.forward}>Forward</button>
                <button onClick={this.reset}>Reset</button>
            </MainContext.Provider>
        );
    }
}

export default MainPage;