import { Component, PureComponent, createElement, Fragment } from "react";
import { render as reactRender } from 'react-dom';
import { Router, Route, Switch } from 'react-router';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import LowCodeRenderer from '../react-renderer/index.ts';
import { computed, observable, makeObservable } from "mobx";
import { createMemoryHistory, MemoryHistory } from 'history';
import { host } from '../host/index.ts';
import "./designer.less"
import { BuiltinSimulatorHostView } from "../builtin-simulator/host-view.tsx";
import { Project } from "@/project/project.ts";

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

    constructor(props: IProps) {
        super(props);
        const { designer, ...designerProps } = props;
        this.viewName = designer?.viewName;
        if (designer) {
            this.designer = designer;
            // designer.setProps(designerProps);
        } else {
            // this.designer = new Designer(designerProps);
        }
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
function preprocessMetadata(metadata){
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
export class ComponentMeta implements IComponentMeta {
    prototype?: any;
    private _npm?: any;
   
    private _componentName?: string;
    constructor(readonly designer: Designer, metadata: IPublicTypeComponentMetadata) {
        // this.parseMetadata(metadata);
    }
    // private transformMetadata(
    //     metadta: any,
    // ): any {
    //     const registeredTransducers = this.designer.componentActions.getRegisteredMetadataTransducers();
    //     const result = registeredTransducers.reduce((prevMetadata, current) => {
    //         return current(prevMetadata);
    //     }, preprocessMetadata(metadta));

    //     if (!result.configure) {
    //         result.configure = {};
    //     }
    //     if (result.experimental && !result.configure.advanced) {
    //         deprecate(result.experimental, '.experimental', '.configure.advanced');
    //         result.configure.advanced = result.experimental;
    //     }
    //     return result as any;
    // }
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
// export function componentDefaults(metadata: Metadata): Metadata {
//   const { configure, componentName } = metadata;
//   const { component = {} } = configure;
//   if (!component.nestingRule) {
//     let m;
//     // uri match xx.Group set subcontrolling: true, childWhiteList
//     // eslint-disable-next-line no-cond-assign
//     if ((m = /^(.+)\.Group$/.exec(componentName))) {
//       // component.subControlling = true;
//       component.nestingRule = {
//         childWhitelist: [`${m[1]}`],
//       };
//       // eslint-disable-next-line no-cond-assign
//     } else if ((m = /^(.+)\.Node$/.exec(componentName))) {
//       // uri match xx.Node set selfControlled: false, parentWhiteList
//       // component.selfControlled = false;
//       component.nestingRule = {
//         parentWhitelist: [`${m[1]}`, componentName],
//       };
//       // eslint-disable-next-line no-cond-assign
//     } else if ((m = /^(.+)\.(Item|Node|Option)$/.exec(componentName))) {
//       // uri match .Item .Node .Option set parentWhiteList
//       component.nestingRule = {
//         parentWhitelist: [`${m[1]}`],
//       };
//     }
//   }
//   // if (component.isModal == null && /Dialog/.test(componentName)) {
//   //   component.isModal = true;
//   // }
//   return {
//     ...metadata,
//     configure: {
//       ...configure,
//       component,
//     },
//   };
// }
// export function legacyIssues(metadata) {
//   const { devMode } = metadata;
//   return {
//     ...metadata,
//     devMode: devMode?.replace(/(low|pro)code/, '$1Code')
//   };
// }
// export class ComponentActions {
//   private metadataTransducers = [];

//   actions = [
//     {
//       name: 'remove',
//       content: {
//         icon: IconRemove,
//         title: intlNode('remove'),
//         /* istanbul ignore next */
//         action(node: IPublicModelNode) {
//           node.remove();
//         },
//       },
//       important: true,
//     },
//     {
//       name: 'hide',
//       content: {
//         icon: IconHidden,
//         title: intlNode('hide'),
//         /* istanbul ignore next */
//         action(node: IPublicModelNode) {
//           node.visible = false;
//         },
//       },
//       /* istanbul ignore next */
//       condition: (node: IPublicModelNode) => {
//         return node.componentMeta?.isModal;
//       },
//       important: true,
//     },
//     {
//       name: 'copy',
//       content: {
//         icon: IconClone,
//         title: intlNode('copy'),
//         /* istanbul ignore next */
//         action(node: IPublicModelNode) {
//           // node.remove();
//           const { document: doc, parent, index } = node;
//           if (parent) {
//             const newNode = doc?.insertNode(parent, node, (index ?? 0) + 1, true);
//             deduplicateRef(newNode);
//             newNode?.select();
//             const { isRGL, rglNode } = node?.getRGL();
//             if (isRGL) {
//               // 复制 layout 信息
//               const layout: any = rglNode?.getPropValue('layout') || [];
//               const curLayout = layout.filter((item: any) => item.i === node.getPropValue('fieldId'));
//               if (curLayout && curLayout[0]) {
//                 layout.push({
//                   ...curLayout[0],
//                   i: newNode?.getPropValue('fieldId'),
//                 });
//                 rglNode?.setPropValue('layout', layout);
//                 // 如果是磁贴块复制，则需要滚动到影响位置
//                 setTimeout(() => newNode?.document?.project?.simulatorHost?.scrollToNode(newNode), 10);
//               }
//             }
//           }
//         },
//       },
//       important: true,
//     },
//     {
//       name: 'lock',
//       content: {
//         icon: IconLock, // 锁定 icon
//         title: intlNode('lock'),
//         /* istanbul ignore next */
//         action(node: IPublicModelNode) {
//           node.lock();
//         },
//       },
//       /* istanbul ignore next */
//       condition: (node: IPublicModelNode) => {
//         return engineConfig.get('enableCanvasLock', false) && node.isContainerNode && !node.isLocked;
//       },
//       important: true,
//     },
//     {
//       name: 'unlock',
//       content: {
//         icon: IconUnlock, // 解锁 icon
//         title: intlNode('unlock'),
//         /* istanbul ignore next */
//         action(node: IPublicModelNode) {
//           node.lock(false);
//         },
//       },
//       /* istanbul ignore next */
//       condition: (node: IPublicModelNode) => {
//         return engineConfig.get('enableCanvasLock', false) && node.isContainerNode && node.isLocked;
//       },
//       important: true,
//     },
//   ];

//   constructor() {
//     this.registerMetadataTransducer(legacyIssues, 2, 'legacy-issues'); // should use a high level priority, eg: 2
//     this.registerMetadataTransducer(componentDefaults, 100, 'component-defaults');
//   }

//   removeBuiltinComponentAction(name: string) {
//     const i = this.actions.findIndex((action) => action.name === name);
//     if (i > -1) {
//       this.actions.splice(i, 1);
//     }
//   }
//   addBuiltinComponentAction(action: any) {
//     this.actions.push(action);
//   }

//   modifyBuiltinComponentAction(
//     actionName: string,
//     handle: (action: any) => void,
//   ) {
//     const builtinAction = this.actions.find((action) => action.name === actionName);
//     if (builtinAction) {
//       handle(builtinAction);
//     }
//   }

//   registerMetadataTransducer(
//     transducer: any,
//     level = 100,
//     id?: string,
//   ) {
//     transducer.level = level;
//     transducer.id = id;
//     const i = this.metadataTransducers.findIndex((item) => item.level != null && item.level > level);
//     if (i < 0) {
//       this.metadataTransducers.push(transducer);
//     } else {
//       this.metadataTransducers.splice(i, 0, transducer);
//     }
//   }

//   getRegisteredMetadataTransducers(): any[] {
//     return this.metadataTransducers;
//   }
// }
export class Designer {
    readonly project: any;
    // readonly componentActions = new ComponentActions();
    private _lostComponentMetasMap = new Map();
    private _componentMetasMap = new Map();
    constructor(props: DesignerProps) {
        this.project = new Project(this, undefined,);
    }
    createComponentMeta(data: IPublicTypeComponentMetadata): IComponentMeta | null {
        const key = data.componentName;
        if (!key) {
            return null;
        }
        let meta = this._componentMetasMap.get(key);
        if (meta) {
            meta.setMetadata(data);
            this._componentMetasMap.set(key, meta);
        } else {
            meta = new ComponentMeta(this, data);
            this._componentMetasMap.set(key, meta);
        }
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
        extraEnvironment: null,
        renderEnv: 'default',
        device: 'default',
        locale: '',
        designMode: 'live',
        deviceClassName: '',
        simulatorUrl: null,
        requestHandlersMap: null,
    };

    private _mounted = true;

    constructor(props: any) {
        super(props);
    }


    componentWillUnmount() {
        this._mounted = false;
    }

    render(): React.ReactNode {
        const editor = this.props.engineEditor;
        // const {
        //     componentMetadatas,
        //     library,
        // } = this.state;

        // if (!library || !componentMetadatas) {
        //     // TODO: use a Loading
        //     return null;
        // }

        return (
            <DesignerView className="lowcode-plugin-designer" designer={editor.get('designer')} />
        );
    }
}
