import React from 'react';

class Graphic extends React.Component {
    constructor(props) {
        super(props);
        this.paint = this.doPaint.bind(this);
    }

    componentDidUpdate() {
        this.doPaint();
    }

    doPaint() {
        const { contextInfo, processor } = this.props;        
        const {width, height} = contextInfo.state.ui;
        const context = this.refs.canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
        context.save();
        processor(context, contextInfo);
        context.restore();
    }

    render() {
        const { width, height } = this.props.contextInfo.state.ui;
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
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        requestAnimationFrame(this.tick);
    }

    tick() {        
        const contextInfo = this.props.contextInfo;
        contextInfo.processState();
        requestAnimationFrame(this.tick);
    }

    render() {
        return <Graphic contextInfo={this.props.contextInfo} processor={this.props.processor} />;
    }
}

export {
    Graphic,
    RunWorker,
};