import {computed, observable} from "mobx";
import {Project} from "@/project/project.ts";
import {SettingTopEntry} from "@/designer/setting/setting-top-entry.ts";
import {ComponentActions} from "@/designer/component-actions.ts";
import {ComponentMeta} from "@/designer/component-meta.ts";
import {IPublicTypeComponentMetadata} from "@/types";
import Node from "@/designer/document/node/node.ts";
import {DocumentModel} from "@/designer/document/document-model.ts";
import {OffsetObserver} from "@/designer/offset-observer.ts";

export interface INodeSelector {
    node: Node,
    instance: DocumentModel
}

export function createOffsetObserver(nodeInstance: INodeSelector) {
    if (!nodeInstance.instance) {
        return null;
    }
    return new OffsetObserver(nodeInstance);
}

export class Designer {
    readonly project: any;
    private _componentMetasMap = new Map();
    readonly componentActions = new ComponentActions();
    readonly editor;
    readonly viewName;
    private props;
    readonly shellModelFactory;
    @observable.ref private _simulatorProps?: any;
    private selectionDispose: undefined | (() => void);

    // @observable.ref private _simulatorComponent: any;
    constructor(props) {
        this.project = new Project(this, undefined,);
        const {editor, shellModelFactory} = props;
        this.shellModelFactory = shellModelFactory;
        this.editor = editor;
        this.project.onCurrentDocumentChange(() => {
            this.setupSelection();
        })
        this.setupSelection();
    }

    createSettingEntry(nodes: any[]): SettingTopEntry {
        return new SettingTopEntry(this.editor, nodes);
    }

    getComponentMeta(componentName: string, generateMetadata?: () => IPublicTypeComponentMetadata | null,): ComponentMeta {
        if (this._componentMetasMap.has(componentName)) {
            return this._componentMetasMap.get(componentName)!
        }
    }

    setProps(nextProps) {
        const props = this.props ? {...this.props, ...nextProps} : nextProps;
        // if (props.simulatorComponent !== this.props?.simulatorComponent) {
        // this._simulatorComponent = props.simulatorComponent;
        // }
        this._simulatorProps = props.simulatorProps;
    }

    createComponentMeta(data) {
        const key = data.componentName;
        if (!key) {
            return null;
        }
        // let meta = this._componentMetasMap.get(key);
        let meta = new ComponentMeta(this, data);
        this._componentMetasMap.set(key, meta);
        return meta;
    }

    buildComponentMetasMap(metas: any[]) {
        metas.forEach((data) => this.createComponentMeta(data));
    }

    async loadIncrementalAssets(incrementalAssets): Promise<void> {
        const {components, packages} = incrementalAssets;
        components && this.buildComponentMetasMap(components);
        // if (packages) {
        //   await this.project.simulator?.setupComponents(packages);
        // }

        // if (components) {
        //   // 合并 assets
        //   let assets = this.editor.get('assets') || {};
        //   let newAssets = mergeAssets(assets, incrementalAssets);
        //   // 对于 assets 存在需要二次网络下载的过程，必须 await 等待结束之后，再进行事件触发
        //   await this.editor.set('assets', newAssets);
        // }
        // // TODO: 因为涉及修改 prototype.view，之后在 renderer 里修改了 vc 的 view 获取逻辑后，可删除
        // this.refreshComponentMetasMap();
        // // 完成加载增量资源后发送事件，方便插件监听并处理相关逻辑
        // this.editor.eventBus.emit('designer.incrementalAssetsReady');
    }

    @computed get projectSimulatorProps(): any {
        return {
            ...this._simulatorProps,
            project: this.project,
            designer: this,
        };
    }

    @computed get componentsMap() {
        const maps: any = {};
        const designer = this;
        designer._componentMetasMap.forEach((config, key) => {
            const metaData = config.getMetadata();
            if (metaData.devMode === 'lowCode') {
                // 例如
                // const lowcodePlugin = (ctx: IPublicModelPluginContext) => {
                //     return {
                //         async init() {
                //             const { material } = ctx;
                //             material.loadIncrementalAssets({
                //                 version: '',
                //                 components: [{
                //                     devMode: 'lowCode',
                //                     componentName: 'LowcodeDemo',
                //                     title: '低代码组件示例',
                //                     group: '低代码组件',
                //                     schema: lowcodeSchema as any,
                //                     snippets: [{
                //                         schema: {
                //                             componentName: 'LowcodeDemo'
                //                         },
                //                     }]
                //                 }],
                //             })
                //         },
                //     };
                maps[key] = metaData.schema;
            } else {
                const {view} = config.advanced;
                if (view) {
                    maps[key] = view;
                } else {
                    maps[key] = config.npm;
                }
            }
        });
        return maps;
    }

    @computed get simulatorProps(): Record<string, any> {
        if (typeof this._simulatorProps === 'function') {
            return this._simulatorProps(this.project);
        }
        return this._simulatorProps || {};
    }

    createOffsetObserver(nodeInstance: INodeSelector) {
        const oobx = createOffsetObserver(nodeInstance);
        this.clearOobxList();
        if (oobx) {
            this.oobxList.push(oobx);
        }
        return oobx;
    }

    private clearOobxList(force?: boolean) {
        let l = this.oobxList.length;
        if (l > 20 || force) {
            while (l-- > 0) {
                if (this.oobxList[l].isPurged()) {
                    this.oobxList.splice(l, 1);
                }
            }
        }
    }

    get currentSelection() {
        return this.currentDocument?.selection;
    }

    get currentDocument() {
        return this.project.currentDocument;
    }

    postEvent(event: string, ...args: any[]) {
        this.editor.eventBus.emit(`designer.${event}`, ...args);
    }

    setupSelection = () => {
        if (this.selectionDispose) {
            this.selectionDispose();
            this.selectionDispose = undefined;
        }
        const {currentSelection} = this;
        // TODO: 避免选中 Page 组件，默认选中第一个子节点；新增规则 或 判断 Live 模式
        if (
            currentSelection &&
            currentSelection.selected.length === 0 &&
            this.simulatorProps?.designMode === 'live'
        ) {
            const rootNodeChildrens = this.currentDocument?.getRoot()?.getChildren()?.children;
            if (rootNodeChildrens && rootNodeChildrens.length > 0) {
                currentSelection.select(rootNodeChildrens[0].id);
            }
        }
        this.postEvent('selection.change', currentSelection);
        if (currentSelection) {
            this.selectionDispose = currentSelection.onSelectionChange(() => {
                this.postEvent('selection.change', currentSelection);
            });
        }
    };
}
