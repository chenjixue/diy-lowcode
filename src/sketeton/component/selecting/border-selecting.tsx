import {observer} from "mobx-react";
import {Component, Fragment} from "react";
import {BuiltinSimulatorHost} from "@/host/host.tsx";
import {computed} from "mobx";
import Node from "@/designer/document/node/node.ts"
import {OffsetObserver} from "@/designer/offset-observer.ts";

@observer
export class BorderSelecting extends Component<{ host: BuiltinSimulatorHost }> {
    get host(): BuiltinSimulatorHost {
        return this.props.host;
    }

    @computed get selecting() {
        const doc = this.host.currentDocument;
        if (!doc) {
            return null;
        }
        const {selection} = doc;
        return selection.getNodes();
    }


    render() {
        const {selecting} = this;
        if (!selecting || selecting.length < 1) {
            return null;
        }

        return (
            <Fragment>
                {selecting.map((node) => (
                    <BorderSelectingForNode key={node.id} host={this.props.host} node={node} />
                ))}
            </Fragment>
        );
    }
}

@observer
export class BorderSelectingForNode extends Component <{ host: BuiltinSimulatorHost; node: Node }> {
    get host(): BuiltinSimulatorHost {
        return this.props.host;
    }

    @computed get instances() {
        return this.host.getComponentInstances(this.props.node);
    }

    render() {
        const {instances} = this;
        const {node} = this.props;
        const {designer} = this.host;
        if (!instances || instances.length < 1) {
            return null;
        }
        return (
            <Fragment key={node.id}>
                {
                    instances.map((instance) => {
                        const observed = designer.createOffsetObserver({
                            node,
                            instance,
                        })
                        if (!observed) {
                            return null;
                        }
                        return <BorderSelectingInstance key={observed.id} observed={observed} />
                    })
                }
            </Fragment>
        )
    }
}

@observer
export class BorderSelectingInstance extends Component<{
    observed: OffsetObserver
}> {
    render() {
        const {observed} = this.props;
        if (!observed.hasOffset) {
            return null;
        }
        const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = observed;
    }
}
