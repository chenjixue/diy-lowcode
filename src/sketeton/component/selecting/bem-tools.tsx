import {observer} from "mobx-react";
import {Component, Fragment} from "react";
import {BuiltinSimulatorHost} from "@/host/host.tsx";
import {BorderSelecting} from "@/sketeton/component/selecting/border-selecting.tsx";

@observer
export class BemTools extends Component<{ host: BuiltinSimulatorHost }> {
    render() {
        const {host} = this.props;
        return (<div className="lc-bem-tools"><BorderSelecting key="selecting" host={host} /></div>);
    }
}

