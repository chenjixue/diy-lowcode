import {uniqueId} from "lodash";
import {observable} from "mobx";
import {INodeSelector} from "@/designer/designer.ts";
import Node from "@/designer/document/node/node.ts"

export class OffsetObserver {
    readonly id = uniqueId('oobx');
    readonly node: Node;
    @observable hasOffset = false;
    private isRoot: boolean;

    constructor(readonly nodeInstance: INodeSelector) {
        const {node, instance} = nodeInstance;
        this.node = node;
        const doc = node.document;
        const host = doc?.simulator;
        const focusNode = doc?.focusNode;
        this.isRoot = node.contains(focusNode!);
    }
}
