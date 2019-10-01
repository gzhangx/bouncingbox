import React from 'react';
import Coords from './boxenv';
import EnergyEnv from './energyenv';

import {MainContext, DEFAULT_STATE} from "./provider";
import {generatePosByTime, sqrtCollideCalc, types} from "../util/timeCalc";

import {Button,ButtonToolbar, FormCheck, Form, FormGroup} from 'react-bootstrap';

import impactSound from '../media/KbdSpacebar.wav';

const INC = 10;
const SLOWFAC = 10;
class MainPage extends React.Component {
    audio = new Audio(impactSound);
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
        this.setState({t: 0, curImpactCount:0 ,paused: false, calculated: null});
    };

    backForward = (inc) => {
        this.setState({t: this.state.t - inc, paused: true, calculated: null});
    };

    nextImpact = ()=>{
        const lastImp = this.state.calculated.impacts[this.state.calculated.impacts.length - 1];
        const opt = Object.assign({toIndex: lastImp.index + 1}, this.state.calculated, {t: this.state.t});
        const calculated = sqrtCollideCalc(opt);
        const imp = this.state.calculated.impacts[this.state.calculated.impacts.length - 1];
        this.setState({t: imp.spent, paused: true, calculated, curImpactCount: imp.index});
        this.checkImpactChange();
    };
    stopOnImpactChanged = ()=>{
        this.setState({stopOnImpact: !this.state.stopOnImpact});
    };

    showEnergy = ()=>{
        this.setState({showEnergy: !this.state.showEnergy});
    };

    checkImpactChange = ()=>{
        const imp = this.state.calculated.impacts[this.state.calculated.impacts.length - 1];
        if (imp && imp.index !== this.state.curImpactCount) {
            const st = {curImpactCount: imp.index};
            if (this.state.stopOnImpact) {
                st.paused = true;
            }
            this.setState(st);
        }
    };

    setCalculated = ()=>{
        let needCalc = !this.state.calculated;
        if (this.state.box2MassUsed != this.state.box2Mass) {
            needCalc = true;
            this.setState({box2MassUsed: this.state.box2Mass, t:0});
        }
        if (needCalc) {
            const origItems = this.getOrigItems(this.state.box2Mass);
            const opt = {t: this.state.t, items: origItems};
            const calculated = sqrtCollideCalc(opt);
            this.setState({calculated, origItems});
        }else {
            const opt = Object.assign({}, this.state.calculated, {t: this.state.t});
            const calculated = sqrtCollideCalc(opt);
            this.setState({calculated});
        }

        const currentItemStatus = generatePosByTime(this.state.calculated, this.state.origItems, this.state.t);
        if (!this.state.currentItemStatus || this.state.currentItemStatus.count !== currentItemStatus.count) {
            if (currentItemStatus.count) this.audio.play();
            this.setState({lastImpactChanged: this.state.t});
        }
        this.setState({currentItemStatus});
        this.checkImpactChange();
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

                    <Form>
                        <Form.Group>
                            <Form.Check inline type="checkbox" label="Pause" checked={this.state.paused} onChange={this.pause} />
                            <Button variant="primary" className="mr-2" onClick={()=>this.backForward(INC)}>Back</Button>
                            <Button className="mr-2" onClick={()=>this.backForward(-INC)}>Forward</Button>
                            <Button className="mr-2" onClick={()=>this.nextImpact()}> >> </Button>
                            <Button className="mr-2" onClick={this.reset}>Reset</Button>
                            <Button className="mr-2"  onClick={this.showEnergy}>Energy</Button>
                            <Form.Check inline type="checkbox" label="Stop on Impact" checked={this.state.stopOnImpact} onChange={this.stopOnImpactChanged} />
                        </Form.Group>
                    </Form>

            </MainContext.Provider>
        );
    }
}

export default MainPage;