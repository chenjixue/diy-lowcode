import { computed, makeObservable, observable } from "mobx";
import Node from "./node"
import { IPublicEnumTransformStage } from "../types";
export class NodeChildren {
    @observable.shallow children: any[];
    constructor(
        readonly owner: Node,
        data: any[],
    ) {
        makeObservable(this);
        this.children = (Array.isArray(data) ? data : [data]).filter(child => !!child).map((child) => {
            return this.owner.document?.createNode(child);
        });
    }
    /**
 * 元素个数
 */
    @computed get size(): number {
        return this.children.length;
    }
    /**
 * 导出 schema
 */
    export(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Save) {
        return this.children.map((node) => {
            const data = node.export(stage);
            return data;
        });
    }
    // internalInitParent() {
    //     this.children.forEach((child) => child.internalSetParent(this.owner));
    // }
}