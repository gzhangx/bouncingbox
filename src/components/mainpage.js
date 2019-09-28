import React from 'react';
import Coords from './boxenv';

import {MainContext, DEFAULT_STATE} from "./provider";
import {sqrtCollideCalc, types} from "../util/timeCalc";
const INC = 10;
class MainPage extends React.Component {
    state = DEFAULT_STATE;
    getOrigItems() {
        return [
            {type: types.WALL, x: 0, id: 'w1'},
            {type: types.BLOCK, x: 390, v: -1, size: 100, id:'b1', m: 100},
            {type: types.BLOCK, x: 200, v: 0, size: 50,id:'b2', m: 1},
        ];
    }
    pause = () => {
        this.setState({paused: !this.state.paused});
    };
    reset = () => {
        this.setState({startTime: performance.now(), paused: false});
    };
    gsetState = (stat)=>{
        this.setState(stat);
    };

    backForward = (inc) => {
        this.setState({startTime: this.getPausedStartTime() + inc, t: this.state.t - inc, paused: true});
    };

    getPausedStartTime = ()=>{
        return this.state.startTime + performance.now() - (this.state.t || 0) - this.state.startTime;
    };

    setCalculated = ()=>{
        if (!this.state.calculated) {
            const origItems = this.getOrigItems();
            const opt = {tdelta: -1, items: origItems};
            const calculated = sqrtCollideCalc(opt);
            this.setState({calculated, origItems});
        }
    };

    processState = ()=>{
        let paused = false;
        
        const contextInfo = this.state;        

        if (contextInfo.paused) {
            paused = true;
            this.setState({startTime: this.getPausedStartTime()});
        }
                    
        if (contextInfo.forward) {
            paused = true;
            this.setState({startTime: this.getPausedStartTime() - INC, t: this.state.t + INC});
            this.setState({forward: false, paused: true})
        }
        
        if (!paused) {
            const tickDiff = (performance.now() - this.state.startTime)/20;
            this.setState({t: tickDiff});
        }

        this.setCalculated();
        
    };

    render() {
        return (
            <MainContext.Provider value={{state: this.state, setState: this.gsetState, processState: this.processState,}}>
                <Coords/>
                <button onClick={this.pause}>Pause</button>
                <button onClick={()=>this.backForward(INC)}>Back</button>
                <button onClick={()=>this.backForward(-INC)}>Forward</button>
                <button onClick={this.reset}>Reset</button>
            </MainContext.Provider>
        );
    }
}

export default MainPage;