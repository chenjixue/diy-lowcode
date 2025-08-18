import { uniqueId } from "@/util/unique-id";
import { computed, observable, makeObservable, action } from "mobx";
// import { IPublicEnumTransformStage } from "../react-simulator-renderer/renderer";
import Node from "./node"
import { IPublicTypeRootSchema } from "../plugin-manager";
import { IPublicEnumTransformStage } from "../types";
export class DocumentModel {
    readonly project: any;
    readonly designer: any;
    rootNode: null;
    private seqId = 0;
    private _nodesMap = new Map();
    @observable.shallow private nodes = new Set();
    id: string = uniqueId('doc');
    constructor(project: any, schema?: IPublicTypeRootSchema) {
        makeObservable(this, {});
        this.project = project;
        this.designer = this.project?.designer;
        this.rootNode = this.createNode(
            schema || {
                componentName: 'Page',
                id: 'root',
                fileName: '',
            },
        );
    }
    get nodesMap(): Map<string, INode> {
        return this._nodesMap;
    }
    /**
 * 导出 schema 数据
 */
    get schema() {
        return this.rootNode?.schema as any;
    }

    /**
 * 根据 id 获取节点
 */
    getNode(id: string): INode | null {
        return this._nodesMap.get(id) || null;
    }
    /**
  * 是否存在节点
  */
    hasNode(id: string): boolean {
        const node = this.getNode(id);
        return node ? !node.isPurged : false;
    }

    @action
    createNode(data: any): any {
        let schema = data;
        let node = new Node(this, schema);
        this._nodesMap.set(node.id, node);
        this.nodes.add(node);
        return node as any;
    }
    /**
 * 生成唯一 id
 */
    nextId(possibleId: string | undefined): string | undefined {
        let id = possibleId;
        // while (!id || this.nodesMap.get(id)) {
        //     id = `node_${(String(this.id).slice(-10) + (++this.seqId).toString(36)).toLocaleLowerCase()}`;
        // }

        return id;
    }
    export(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Serilize) {
        const currentSchema = this.rootNode?.export<IPublicTypeRootSchema>(stage); return currentSchema;
    }
    get fileName(): string {
        return "/"
        // return this.rootNode?.getExtraProp('fileName', false)?.getAsString() || this.id;
    }
}