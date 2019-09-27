import React from 'react';

class Graphic extends React.Component {
    constructor(props) {
        super(props);
        this.paint = this.paint.bind(this);
    }

    componentDidUpdate() {
        this.paint();
    }

    paint() {
        const { contextInfo, processor } = this.props;        
        const {width, height} = contextInfo.state.ui;
        const context = this.refs.canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
        context.save();
        //context.translate(100, 100);
        //context.rotate(rotation, 100, 100);
        //context.fillStyle = "#F00";
        //context.fillRect(-50, -50, 100, 100);
        processor(context, contextInfo);
        context.restore();
    }

    render() {
        const { width, height } = this.props;
        return (
            <canvas
                ref="canvas"
                width={width}
                height={height}
            />
        );
    }
}

class RunWorker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { startTime: performance.now() };
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        requestAnimationFrame(this.tick);
    }

    tick() {
        let paused = false;
        const INC = 10;
        const contextInfo = this.props.contextInfo;
        {
            const tickDiff = performance.now() - (this.state.t || 0) - this.state.startTime;
            if (contextInfo.state.paused) {
                paused = true;
                this.setState({startTime: this.state.startTime + tickDiff});
            }
            if (contextInfo.state.reset) {
                this.setState({startTime: performance.now()});
                contextInfo.setState({reset: false});
            }
            if (contextInfo.state.back) {
                paused = true;
                this.setState({startTime: this.state.startTime + tickDiff + INC, t: this.state.t - INC});
                contextInfo.setState({back: false, paused: true})
            }
            if (contextInfo.state.forward) {
                paused = true;
                this.setState({startTime: this.state.startTime + tickDiff - INC, t: this.state.t + INC});
                contextInfo.setState({forward: false, paused: true})
            }
        }

        if (!paused) {
            const tickDiff = performance.now() - this.state.startTime;
            this.setState({t: tickDiff});
        }

        requestAnimationFrame(this.tick);
    }

    render() {
        return <Graphic width={this.props.contextInfo.state.ui.width} height={this.props.contextInfo.state.ui.height}
         contextInfo={Object.assign({}, {t:this.state.t},this.props.contextInfo)} processor={this.props.processor} />;
    }
}

export {
    Graphic,
    RunWorker,
};