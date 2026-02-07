// import { IPublicEnumTransformStage } from "../react-simulator-renderer/renderer";
// import { IPublicEnumTransformStage } from "../react-simulator-renderer/renderer";
import {IPublicEnumTransformStage} from "../../../types";
import {NodeChildren} from "./node-children.ts";
import {Props} from "./props.ts";
import {SettingTopEntry} from "@/designer/setting/setting-top-entry.ts";
import {computed} from "mobx";
import Prop from "@/designer/document/node/prop.ts";

export default class Node {
    readonly id: string;
    readonly componentName: string;
    protected _children?: any;
    /**
     * 属性抽象
     */
    props: any;
    _settingEntry?: SettingTopEntry;

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

    getProp(path: string, createIfNone = true): Prop | null {
        return this.props.query(path, createIfNone) || null;
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
