import React from 'react';
import Coords from './boxenv';

import {MainContext, DEFAULT_STATE} from "./provider";
import {sqrtCollideCalc, types} from "../util/timeCalc";
const INC = 10;
const SLOWFAC = 10;
class MainPage extends React.Component {
    state = DEFAULT_STATE;
    getOrigItems() {
        return [
            {type: types.WALL, x: 0, id: 'w1'},
            {type: types.BLOCK, x: 390, v: -1, size: 100, id:'b1', m: 1000000},
            {type: types.BLOCK, x: 200, v: 0, size: 50,id:'b2', m: 1},
        ];
    }
    pause = () => {
        this.setState({paused: !this.state.paused});
    };
    reset = () => {
        this.setState({t: 0, paused: false});
    };

    backForward = (inc) => {
        this.setState({t: this.state.t - inc, paused: true});
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
        if (this.state.paused) {
            this.setState({lastTimeCheck: performance.now()});
        } else{
            const now = performance.now();
            const tickDiff = (now - this.state.lastTimeCheck);
            if (tickDiff < SLOWFAC) {
                return;
            }
            const newT = this.state.t + (tickDiff/SLOWFAC);
            this.setState({t: newT, lastTimeCheck: now});
        }

        this.setCalculated();
        
    };

    render() {
        return (
            <MainContext.Provider value={{state: this.state, processState: this.processState,}}>
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