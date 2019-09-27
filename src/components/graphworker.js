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
        const { width, height, processor } = this.props;
        const context = this.refs.canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
        context.save();
        //context.translate(100, 100);
        //context.rotate(rotation, 100, 100);
        //context.fillStyle = "#F00";
        //context.fillRect(-50, -50, 100, 100);
        processor(context, this.props);
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
        if (this.props.contextState && this.props.contextState.paused) {
            const tickDiff = performance.now() - (this.state.t || 0) - this.state.startTime;
            this.setState({startTime: this.state.startTime + tickDiff});
        }else {
            const tickDiff = performance.now() - this.state.startTime;
            this.setState({t: tickDiff});
        }
        requestAnimationFrame(this.tick);
    }

    render() {
        return <Graphic t={this.state.t} width={this.props.width} height={this.props.height} processor={this.props.processor} />;
    }
}

export {
    Graphic,
    RunWorker,
};