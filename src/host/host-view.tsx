import {Component, Fragment} from "react";
import {BuiltinSimulatorHost} from "./host.tsx";
import {observer} from "mobx-react";
import {computed} from "mobx";

@observer
class Content extends Component<{ host: BuiltinSimulatorHost }> {
    state = {
        disabledEvents: false,
    };

    private dispose?: () => void;

    componentDidMount() {
        // const editor = this.props.host.designer.editor;
    }

    componentWillUnmount() {
        this.dispose?.();
    }

    render() {
        const sim = this.props.host;
        // const { disabledEvents } = this.state;
        // const { viewport, designer } = sim;
        // const frameStyle: any = {
        //   transform: `scale(${viewport.scale})`,
        //   height: viewport.contentHeight,
        //   width: viewport.contentWidth,
        // };
        // if (disabledEvents) {
        //   frameStyle.pointerEvents = 'none';
        // }

        // const { viewName } = designer;

        return (
            <div className="lc-simulator-content">
                {/* name={`${viewName}-SimulatorRenderer`}
          className="lc-simulator-content-frame"
          style={frameStyle}
          ref={(frame) => sim.mountContentFrame(frame)} */}
                <iframe
                    className="lc-simulator-iframe"
                    ref={(frame) => sim.mountContentFrame(frame)}
                />
            </div>
        );
    }
}

@observer
class Canvas extends Component<{ host: BuiltinSimulatorHost }> {
    render() {
        const sim = this.props.host;
        let className = 'lc-simulator-canvas';
        return (
            <div className={className}>
                <div className="lc-simulator-canvas-viewport">
                    <BemTools host={sim} />
                    <Content host={sim} />
                </div>
            </div>
        );
    }
}

class Layout extends Component {
    render() {
        const {children} = this.props;
        return <Fragment>{children}</Fragment>;
    }
}

export class BuiltinSimulatorHostView extends Component<SimulatorHostProps> {
    readonly host: BuiltinSimulatorHost;

    constructor(props: any) {
        super(props);
        const {project, onMount, designer} = this.props;
        this.host = new BuiltinSimulatorHost(project, designer);
        this.host.setProps(this.props);
        // onMount?.(this.host);
    }

    // shouldComponentUpdate(nextProps: BuiltinSimulatorProps) {
    //   this.host.setProps(nextProps);
    //   return false;
    // }

    render() {
        return (
            <div className="lc-simulator">
                {/* progressing.visible ? <PreLoaderView /> : null */}
                <Canvas host={this.host} />
            </div>
        );
    }
}
