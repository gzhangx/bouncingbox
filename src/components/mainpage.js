import React from 'react';
import Coords from './boxenv';
import EnergyEnv from './energyenv';

import {MainContext, DEFAULT_STATE} from "./provider";
import {generatePosByTime, sqrtCollideCalc, types} from "../util/timeCalc";

import {Button,ButtonToolbar} from 'react-bootstrap';

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
        this.setState({t: 0, paused: false, calculated: null});
    };

    backForward = (inc) => {
        this.setState({t: this.state.t - inc, paused: true, calculated: null});
    };

    showEnergy = ()=>{
        this.setState({showEnergy: !this.state.showEnergy});
    };

    setCalculated = ()=>{
        let needCalc = !this.state.calculated;
        if (this.state.box2MassUsed != this.state.box2Mass) {
            needCalc = true;
            this.setState({box2MassUsed: this.state.box2Mass, t:0});
        }
        if (needCalc) {
            const origItems = this.getOrigItems(this.state.box2Mass);
            const opt = {tdelta: this.state.t, items: origItems};
            const calculated = sqrtCollideCalc(opt);
            this.setState({calculated, origItems});
        }else {
            const opt = Object.assign({}, this.state.calculated, {tdelta: this.state.t});
            const calculated = sqrtCollideCalc(opt);
            calculated.impacts = calculated.impacts;
            this.setState({calculated});
        }

        const currentItemStatus = generatePosByTime(this.state.calculated, this.state.origItems, this.state.t);
        if (!this.state.currentItemStatus || this.state.currentItemStatus.count !== currentItemStatus.count) {
            this.setState({lastImpactChanged: this.state.t});
        }
        this.setState({currentItemStatus});

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
                <div>
                <Coords/>
                    {this.state.showEnergy?<EnergyEnv/>:null}
                </div>
                <form class="form-inline">
                <div class="form-group">    
                    <div class="input-group">
                    <input type="number" class="form-control mb-2" placeholder="Mass" value={this.state.box2Mass}
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
                <ButtonToolbar>
                    <Button variant="primary" className="align-self-center mr-2" onClick={this.pause}>Pause</Button>
                    <Button variant="primary" className="mr-2" onClick={()=>this.backForward(INC)}>Back</Button>
                    <Button  className="mr-2" onClick={()=>this.backForward(-INC)}>Forward</Button>
                    <Button  className="mr-2" onClick={this.reset}>Reset</Button>
                    <Button onClick={this.showEnergy}>Energy</Button>
                </ButtonToolbar>
            </MainContext.Provider>
        );
    }
}

export default MainPage;