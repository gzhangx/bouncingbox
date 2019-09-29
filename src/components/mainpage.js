import React from 'react';
import Coords from './boxenv';

import {MainContext, DEFAULT_STATE} from "./provider";
import {sqrtCollideCalc, types} from "../util/timeCalc";

//import {Button,ButtonToolbar} from 'react-bootstrap';

const INC = 10;
const SLOWFAC = 10;
class MainPage extends React.Component {
    state = DEFAULT_STATE;
    getOrigItems(m) {
        const size = 50*(1+ Math.log10(m));        
        const res = [
            {type: types.WALL, x: 0, id: 'w1'},
            {type: types.BLOCK, x: 390, v: -1, size, id:'b1', m},
            {type: types.BLOCK, x: 200, v: 0, size: 50,id:'b2', m: 1},
        ];
        const b1Pos = res[2].x+ (res[2].size/2);
        const b2Ext = b1Pos+ (res[1].size/2);
        if (b2Ext >= res[1].x) {
            res[1].x = b2Ext + 100;
        }
        return res;
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
        let needCalc = !this.state.calculated;
        if (this.state.box2MassUsed != this.state.box2Mass) {
            needCalc = true;
            this.setState({box2MassUsed: this.state.box2Mass, t:0});
        }
        if (needCalc) {
            const origItems = this.getOrigItems(this.state.box2Mass);
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
                <form class="form-inline">
                <div class="form-group">    
                    <div class="input-group">
                    <input type="number" class="form-control" placeholder="Mass" value={this.state.box2Mass} 
                    onChange={v=>{
                        let box2Mass =  parseInt(v.target.value);
                        if (isNaN(box2Mass)) {
                            box2Mass = 100;
                        } 
                        this.setState({box2Mass})
                    }}
                    />
                    </div>
                </div>
                </form>
                <buttonToolbar>
                
                <button variant="primary" className="align-self-center mr-2" onClick={this.pause}>Pause</button>
                <button variant="primary" className="mr-2" onClick={()=>this.backForward(INC)}>Back</button>
                <button  className="mr-2" onClick={()=>this.backForward(-INC)}>Forward</button>
                <button  className="mr-2" onClick={this.reset}>Reset</button>
                </buttonToolbar>
            </MainContext.Provider>
        );
    }
}

export default MainPage;