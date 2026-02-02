import {Component} from "react";
import {BuiltinSimulatorHostView} from "@/host/host-view.tsx";
import "./project.less"

export class ProjectView extends Component<{ designer: Designer }> {
    componentDidMount() {
        const {designer} = this.props;
        const {project} = designer;
    }

    render() {
        const {designer} = this.props;
        const {projectSimulatorProps: simulatorProps} = designer;
        const Simulator = BuiltinSimulatorHostView;
        return (
            <div className="lc-project">
            <div className="lc-simulator-shell">
                <Simulator {...simulatorProps} />
        </div>
        </div>
    );
    }
}
