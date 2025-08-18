import { Component, PureComponent, createElement, Fragment } from "react";
import { render as reactRender } from 'react-dom';
import { Router, Route, Switch } from 'react-router';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { computed, observable, makeObservable } from "mobx";
import { createMemoryHistory, MemoryHistory } from 'history';
import "./designer.less"
import { BuiltinSimulatorHostView } from "../builtin-simulator/host-view.tsx";
import { Project } from "@/project/project.ts";
import { componentDefaults, legacyIssues } from "./component-actions.ts";

export class ProjectView extends Component<{ designer: Designer }> {
    componentDidMount() {
        const { designer } = this.props;
        const { project } = designer;
    }
    render() {
        const { designer } = this.props;
        const { projectSimulatorProps: simulatorProps } = designer;
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

export class DesignerView extends Component {
    readonly designer: IDesigner;
    readonly viewName: string | undefined;
    @observable.ref private _simulatorProps: any;
    constructor(props: IProps) {
        super(props);
        const { designer, ...designerProps } = props;
        this.viewName = designer?.viewName;
        if (designer) {
            this.designer = designer;
            designer.setProps(designerProps);
        } else {
            // this.designer = new Designer(designerProps);
        }
    }
    setProps(nextProps: DesignerProps) {
        const props = this.props ? { ...this.props, ...nextProps } : nextProps;
        // if (props.simulatorProps !== this.props.simulatorProps) {
        this._simulatorProps = props.simulatorProps;
        // }
    }
    @computed get simulatorProps(): Record<string, any> {
        return this._simulatorProps || {};
    }
    render() {
        const { className, style } = this.props;
        return (
            <div className={classNames('lc-designer', className)} style={style}>
                <ProjectView designer={this.designer} />
            </div>
        );
    }
}
function preprocessMetadata(metadata) {
    if (metadata.configure) {
        if (Array.isArray(metadata.configure)) {
            return {
                ...metadata,
                configure: {
                    props: metadata.configure,
                },
            };
        }
        return metadata as any;
    }

    return {
        ...metadata,
        configure: {},
    };
}
export class ComponentMeta {
    prototype?: any;
    private _npm?: any;
    private _title?: any;
    private _componentName?: string;
    private _transformedMetadata?: any;
    get componentName(): string {
        return this._componentName!;
    }
    constructor(readonly designer: Designer, metadata: any) {
        this.parseMetadata(metadata);
    }
    getMetadata() {
        return this._transformedMetadata!;
    }
    get npm() {
        return this._npm;
    }
    get advanced() {
        return this.getMetadata().configure.advanced || {};
    }
    private parseMetadata(metadata: any) {
        const { componentName, npm, ...others } = metadata;
        let _metadata = metadata;
        if ((metadata as any).prototype) {
            this.prototype = (metadata as any).prototype;
        }
        this._npm = npm || this._npm;
        this._componentName = componentName;

        // 额外转换逻辑
        this._transformedMetadata = this.transformMetadata(_metadata);

        const { title } = this._transformedMetadata;
        if (title) {
            this._title =
                typeof title === 'string'
                    ? {
                        type: 'i18n',
                        'en-US': this.componentName,
                        'zh-CN': title,
                    }
                    : title;
        }
    }
    private transformMetadata(
        metadta: any,
    ): any {
        const registeredTransducers = this.designer.componentActions.getRegisteredMetadataTransducers();
        const result = registeredTransducers.reduce((prevMetadata, current) => {
            return current(prevMetadata);
        }, preprocessMetadata(metadta));
        return result as any;
    }
    // private parseMetadata(metadata: IPublicTypeComponentMetadata) {
    //     const { componentName, npm, ...others } = metadata;
    //     let _metadata = metadata;
    //     if ((metadata as any).prototype) {
    //         this.prototype = (metadata as any).prototype;
    //     }
    //     if (!npm && !Object.keys(others).length) {
    //         // 没有注册的组件，只能删除，不支持复制、移动等操作
    //         _metadata = {
    //             componentName,
    //             configure: {
    //                 component: {
    //                     disableBehaviors: ['copy', 'move', 'lock', 'unlock'],
    //                 },
    //                 advanced: {
    //                     callbacks: {
    //                         onMoveHook: () => false,
    //                     },
    //                 },
    //             },
    //         };
    //     }
    //     this._npm = npm || this._npm;
    //     this._componentName = componentName;

    //     // 额外转换逻辑
    //     this._transformedMetadata = this.transformMetadata(_metadata);

    //     const { title } = this._transformedMetadata;
    //     if (title) {
    //         this._title =
    //             typeof title === 'string'
    //                 ? {
    //                     type: 'i18n',
    //                     'en-US': this.componentName,
    //                     'zh-CN': title,
    //                 }
    //                 : title;
    //     }

    //     const liveTextEditing = this.advanced.liveTextEditing || [];

    //     function collectLiveTextEditing(items: IPublicTypeFieldConfig[]) {
    //         items.forEach((config) => {
    //             if (config?.items) {
    //                 collectLiveTextEditing(config.items);
    //             } else {
    //                 const liveConfig = config.liveTextEditing || config.extraProps?.liveTextEditing;
    //                 if (liveConfig) {
    //                     liveTextEditing.push({
    //                         propTarget: String(config.name),
    //                         ...liveConfig,
    //                     });
    //                 }
    //             }
    //         });
    //     }
    //     collectLiveTextEditing(this.configure);
    //     this._liveTextEditing = liveTextEditing.length > 0 ? liveTextEditing : undefined;

    //     const isTopFixed = this.advanced.isTopFixed;

    //     if (isTopFixed) {
    //         this._isTopFixed = isTopFixed;
    //     }

    //     const { configure = {} } = this._transformedMetadata;
    //     this._acceptable = false;

    //     const { component } = configure;
    //     if (component) {
    //         this._isContainer = !!component.isContainer;
    //         this._isModal = !!component.isModal;
    //         this._descriptor = component.descriptor;
    //         this._rootSelector = component.rootSelector;
    //         this._isMinimalRenderUnit = component.isMinimalRenderUnit;
    //         if (component.nestingRule) {
    //             const { parentWhitelist, childWhitelist } = component.nestingRule;
    //             this.parentWhitelist = buildFilter(parentWhitelist);
    //             this.childWhitelist = buildFilter(childWhitelist);
    //         }
    //     } else {
    //         this._isContainer = false;
    //         this._isModal = false;
    //     }
    //     this.emitter.emit('metadata_change');
    // }
}
export class ComponentActions {
    private metadataTransducers: any[] = [];

    constructor() {
        this.registerMetadataTransducer(legacyIssues, 2, 'legacy-issues'); // should use a high level priority, eg: 2
        this.registerMetadataTransducer(componentDefaults, 100, 'component-defaults');
    }

    registerMetadataTransducer(
        transducer: any,
        level = 100,
        id?: string,
    ) {
        transducer.level = level;
        transducer.id = id;
        const i = this.metadataTransducers.findIndex((item) => item.level != null && item.level > level);
        if (i < 0) {
            this.metadataTransducers.push(transducer);
        } else {
            this.metadataTransducers.splice(i, 0, transducer);
        }
    }

    getRegisteredMetadataTransducers(): any[] {
        return this.metadataTransducers;
    }
}

export class Designer {
    readonly project: any;
    private _lostComponentMetasMap = new Map();
    private _componentMetasMap = new Map();
    readonly componentActions = new ComponentActions();
    @observable.ref private _simulatorProps?: any;
    // @observable.ref private _simulatorComponent: any;
    constructor(props: DesignerProps) {
        this.project = new Project(this, undefined,);
    }
    setProps(nextProps) {
        const props = this.props ? { ...this.props, ...nextProps } : nextProps;
        // if (props.simulatorComponent !== this.props?.simulatorComponent) {
        // this._simulatorComponent = props.simulatorComponent;
        // }
        this._simulatorProps = props.simulatorProps;
    }
    createComponentMeta(data: IPublicTypeComponentMetadata): IComponentMeta | null {
        const key = data.componentName;
        if (!key) {
            return null;
        }
        // let meta = this._componentMetasMap.get(key);
        let meta = new ComponentMeta(this, data);
        this._componentMetasMap.set(key, meta);
        return meta;
    }

    buildComponentMetasMap(metas: IPublicTypeComponentMetadata[]) {
        metas.forEach((data) => this.createComponentMeta(data));
    }

    async loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): Promise<void> {
        const { components, packages } = incrementalAssets;
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

    @computed get componentsMap(): { [key: string]: IPublicTypeNpmInfo | Component } {
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
                const { view } = config.advanced;
                if (view) {
                    maps[key] = view;
                } else {
                    maps[key] = config.npm;
                }
            }
        });
        return maps;
    }
}

export default class DesignerPlugin extends PureComponent<any, any> {
    static displayName: 'LowcodePluginDesigner';

    state = {
        componentMetadatas: null,
        library: null,
    };

    private _mounted = true;

    constructor(props: any) {
        super(props);
        this.setupAssets();
    }

    private async setupAssets() {
        const editor = this.props.engineEditor;
        const assets = await editor.onceGot('assets');
        const { components, packages, extraEnvironment, utils } = assets;
        const state = {
            componentMetadatas: components || [],
            library: packages || [],
        };
        this.setState(state);
    }
    componentWillUnmount() {
        this._mounted = false;
    }

    render(): React.ReactNode {
        const editor = this.props.engineEditor;
        // if (!library || !componentMetadatas) {
        //     // TODO: use a Loading
        //     return null;
        // }
        const {
            componentMetadatas,
            library,
        } = this.state;

        if (!library) {
            // TODO: use a Loading
            return null;
        }
        return (
            <DesignerView className="lowcode-plugin-designer" designer={editor.get('designer')}
                simulatorProps={{
                    library
                }}
            />
        );
    }
}
