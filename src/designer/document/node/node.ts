// import { IPublicEnumTransformStage } from "../react-simulator-renderer/renderer";
// import { IPublicEnumTransformStage } from "../react-simulator-renderer/renderer";
import {IPublicEnumTransformStage} from "../../../types";
import {NodeChildren} from "./node-children.ts";
import {Props} from "./props.ts";
import {SettingTopEntry} from "@/designer/setting/setting-top-entry.ts";
import {computed, observable} from "mobx";
import Prop from "@/designer/document/node/prop.ts";


export function getZLevelTop(child: Node, zLevel: number) {
    let l = child.zLevel;
    if (l < zLevel || zLevel < 0) {
        return null;
    }
    if (l === zLevel) {
        return child;
    }
    let r: any = child;
    while (r && l > zLevel) {
        r = r.parent;
        l--;
    }
    return r;
}

export function contains(node1: Node, node2: Node): boolean {
    if (node1 === node2) {
        return true;
    }

    if (!node1.isParentalNode || !node2.parent) {
        return false;
    }

    const p = getZLevelTop(node2, node1.zLevel);
    if (!p) {
        return false;
    }

    return node1 === p;
}

export default class Node {
    readonly id: string;
    readonly componentName: string;
    protected _children?: any;
    /**
     * 属性抽象
     */
    props: any;
    _settingEntry?: SettingTopEntry;
    @observable.ref private _parent: Node | null = null;

    constructor(readonly document: any, nodeSchema: any) {
        const {componentName, id, children, props, ...extras} = nodeSchema;
        this.id = id;
        this.componentName = componentName;
        this.props = new Props(this, props, extras);
        this._children = new NodeChildren(this, this.initialChildren(children));
    }

    @computed get componentMeta() {
        return this.document.getComponentMeta(this.componentName);
    }

    get parent(): Node | null {
        return this._parent;
    }

    @computed get zLevel(): number {
        if (this._parent) {
            return this._parent.zLevel + 1;
        }
        return 0;
    }

    internalToShellNode() {
        return this.document.designer.shellModelFactory.createNode(this);
    }

    getProp(path: string, createIfNone = true): Prop | null {
        return this.props.query(path, createIfNone) || null;
    }

    contains(node: Node): boolean {
        return contains(this, node);
    }

    isParental(): boolean {
        return this.isParentalNode;
    }

    get isParentalNode(): boolean {
        return !this.isLeafNode;
    }

    get isLeafNode(): boolean {
        return this.componentName === 'Leaf';
    }

    private initialChildren(children: any) {
        if (children == null) {
            return [];
        }
        if (Array.isArray(children)) {
            return children;
        }
        return [children];
    }

    get settingEntry(): SettingTopEntry {
        if (this._settingEntry) return this._settingEntry;
        this._settingEntry = this.document.designer.createSettingEntry([this]);
        return this._settingEntry;
    }

    /**
     * 当前节点子集
     */
    get children() {
        return this._children || null;
    }

    /**
     * 获取符合搭建协议-节点 schema 结构
     */
    get schema(): any {
        return this.export(IPublicEnumTransformStage.Save);
    }

    /**
     * 导出 schema
     */
    export(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Save, options: any = {}): T {
        const baseSchema: any = {
            componentName: this.componentName,
        };
        const {props = {}, extras} = this.props.export(stage) || {};
        // const _extras_: { [key: string]: any } = { ...extras, };
        if (stage !== IPublicEnumTransformStage.Clone) {
            baseSchema.id = this.id;
        }
        if (stage === IPublicEnumTransformStage.Render) {
            baseSchema.docId = this.document.id;
        }
        const schema: any = {
            ...baseSchema,
            props
            // props: this.document.designer.transformProps(props, this, stage),
            // ...this.document.designer.transformProps(_extras_, this, stage),
        };
        if (this.children && this.children.size > 0) {
            schema.children = this.children.export(stage);
        }
        return schema;
    }
}
