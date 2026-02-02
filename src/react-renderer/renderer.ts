import React, {createElement, ReactInstance} from 'react';
import {render as reactRender} from 'react-dom';
// import { BuiltinSimulatorHost } from '@/core/host/host.tsx';
import {createMemoryHistory, MemoryHistory} from 'history';
import SimulatorRendererView from "@/react-renderer/renderer-view.tsx"
import {host} from '../host';
import DocumentInstance, {SYMBOL_VDID} from '@/designer/document/document-instance.ts';
import {buildComponents} from "@/util/render-util.ts"
import {computed, observable, makeObservable} from "mobx";
import {isElement} from "@/util/render-util.ts"
import {SYMBOL_VNID} from "@/designer/document/document-instance.ts"
let REACT_KEY = '';

function getNodeInstance(fiberNode: any, specId?: string) {
    const instance = fiberNode?.stateNode;
    if (instance && SYMBOL_VNID in instance) {
        const nodeId = instance[SYMBOL_VNID];
        const docId = instance[SYMBOL_VDID];
        if (!specId || specId === nodeId) {
            return {
                docId,
                nodeId,
                instance,
            };
        }
    }
    if (!instance && !fiberNode?.return) return null;
    return getNodeInstance(fiberNode?.return);
}

function cacheReactKey(el: Element): Element {
    if (REACT_KEY !== '') {
        return el;
    }
    // react17 采用 __reactFiber 开头
    REACT_KEY = Object.keys(el).find(
        (key) => key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$'),
    ) || '';
    if (!REACT_KEY && (el as HTMLElement).parentElement) {
        return cacheReactKey((el as HTMLElement).parentElement!);
    }
    return el;
}

// dsfsdf
export class SimulatorRendererContainer {
    readonly isSimulatorRenderer = true;
    private disposeFunctions: Array<() => void> = [];
    readonly history: MemoryHistory;

    @observable.ref private _documentInstances: DocumentInstance[] = [];
    get documentInstances() {
        return this._documentInstances;
    }

    @observable.ref private _layout: any = null;

    @computed get layout(): any {
        // TODO: parse layout Component
        return this._layout;
    }

    set layout(value: any) {
        this._layout = value;
    }

    private _libraryMap: { [key: string]: string } = {};

    private _components: Record<string, React.FC | React.ComponentClass> | null = {};

    get components(): Record<string, React.FC | React.ComponentClass> {
        // 根据 device 选择不同组件，进行响应式
        // 更好的做法是，根据 device 选择加载不同的组件资源，甚至是 simulatorUrl
        return this._components || {};
    }

    // context from: utils、constants、history、location、match
    @observable.ref private _appContext: any = {};

    @computed get context(): any {
        return this._appContext;
    }

    @observable.ref private _componentsMap = {};
    @computed get componentsMap(): any {
        return this._componentsMap;
    }

    /**
     * 是否为画布自动渲染
     */
    autoRender = true;

    /**
     * 画布是否自动监听事件来重绘节点
     */
    autoRepaintNode = true;

    private _running = false;

    constructor() {
        makeObservable(this);
        // this.autoRender = host.autoRender;
        this.disposeFunctions.push(host.connect(this, () => {
            // sync layout config
            // this._layout = host.project.get('config').layout;

            // todo: split with others, not all should recompute
            // if (this._libraryMap !== host.libraryMap
            //   || this._componentsMap !== host.designer.componentsMap) {
            this._libraryMap = host.libraryMap || {};
            this._componentsMap = host.designer.componentsMap;
            this.buildComponents();
            // }
        }));
        const documentInstanceMap = new Map<string, DocumentInstance>();
        let initialEntry = '/';
        let firstRun = true;
        this.disposeFunctions.push(host.autorun(() => {
            this._documentInstances = host.project.documents.map((doc) => {
                let inst = documentInstanceMap.get(doc.id);
                if (!inst) {
                    inst = new DocumentInstance(this, doc);
                    documentInstanceMap.set(doc.id, inst);
                }
                return inst;
            });
            const path = '/';
            if (firstRun) {
                initialEntry = path;
                firstRun = false;
            } else if (this.history.location.pathname !== path) {
                this.history.replace(path);
            }
        }));
        const history = createMemoryHistory({
            initialEntries: [initialEntry],
        });
        this.history = history;
        history.listen((location) => {
            const docId = location.pathname.slice(1);
            docId && host.project.open(docId);
        });
    }

    getClosestNodeInstance(
        from: ReactInstance,
        specId?: string,
    ) {
        let el: any = from;
        if (el) {
            if (isElement(el)) {
                el = cacheReactKey(el);
            } else {
                return getNodeInstance(el._reactInternals || el._reactInternalFiber, specId);
            }
        }
        while (el) {
            if (SYMBOL_VNID in el) {
                const nodeId = el[SYMBOL_VNID];
                const docId = el[SYMBOL_VDID];
                if (!specId || specId === nodeId) {
                    return {
                        docId,
                        nodeId,
                        instance: el,
                    };
                }
            }
            // get fiberNode from element
            if (el[REACT_KEY]) {
                return getNodeInstance(el[REACT_KEY], specId);
            }
            el = el.parentElement;
        }
        return null;
    }

    private buildComponents() {
        this._components = buildComponents(
            this._libraryMap,
            this._componentsMap,
            () => {
            } // this.createComponent.bind(this),
        );
        // this._components = {
        //   ...builtinComponents,
        //   ...this._components,
        // };
    }

    // private buildComponents() {
    //   this._components = buildComponents(
    //       this._libraryMap,
    //       this._componentsMap,
    //       this.createComponent.bind(this),
    //     );
    //   this._components = {
    //     ...builtinComponents,
    //     ...this._components,
    //   };
    // }


    // createComponent(schema: IPublicTypeProjectSchema<IPublicTypeComponentSchema>): Component | null {
    //   const _schema: IPublicTypeProjectSchema<IPublicTypeComponentSchema> = {
    //     ...schema,
    //     componentsTree: schema.componentsTree.map(compatibleLegaoSchema),
    //   };

    //   const componentsTreeSchema = _schema.componentsTree[0];

    //   if (componentsTreeSchema.componentName === 'Component' && componentsTreeSchema.css) {
    //     const doc = window.document;
    //     const s = doc.createElement('style');
    //     s.setAttribute('type', 'text/css');
    //     s.setAttribute('id', `Component-${componentsTreeSchema.id || ''}`);
    //     s.appendChild(doc.createTextNode(componentsTreeSchema.css || ''));
    //     doc.getElementsByTagName('head')[0].appendChild(s);
    //   }

    //   const renderer = this;

    //   class LowCodeComp extends React.Component<any, any> {
    //     render() {
    //       const extraProps = getLowCodeComponentProps(this.props);
    //       return createElement(LowCodeRenderer, {
    //         ...extraProps, // 防止覆盖下面内置属性
    //         // 使用 _schema 为了使低代码组件在页面设计中使用变量，同 react 组件使用效果一致
    //         schema: componentsTreeSchema,
    //         components: renderer.components,
    //         designMode: '',
    //         locale: renderer.locale,
    //         messages: _schema.i18n || {},
    //         device: renderer.device,
    //         appHelper: renderer.context,
    //         rendererName: 'LowCodeRenderer',
    //         thisRequiredInJSE: host.thisRequiredInJSE,
    //         faultComponent: host.faultComponent,
    //         faultComponentMap: host.faultComponentMap,
    //         customCreateElement: (Comp: any, props: any, children: any) => {
    //           const componentMeta = host.currentDocument?.getComponentMeta(Comp.displayName);
    //           if (componentMeta?.isModal) {
    //             return null;
    //           }

    //           const { __id, __designMode, ...viewProps } = props;
    //           // mock _leaf，减少性能开销
    //           const _leaf = {
    //             isEmpty: () => false,
    //             isMock: true,
    //           };
    //           viewProps._leaf = _leaf;
    //           return createElement(Comp, viewProps, children);
    //         },
    //       });
    //     }
    //   }

    //   return LowCodeComp;
    // }

    run() {
        if (this._running) {
            return;
        }
        this._running = true;
        const containerId = 'app';
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            container.id = containerId;
        }

        // ==== compatible vision
        document.documentElement.classList.add('engine-page');
        document.body.classList.add('engine-document'); // important! Stylesheet.invoke depends

        reactRender(createElement(SimulatorRendererView, {rendererContainer: this}), container);
        // host.project.setRendererReady(this);
    }
}

const SimulatorRendererContainerInstance = new SimulatorRendererContainer();
(window as any).SimulatorRenderer = SimulatorRendererContainerInstance
export default SimulatorRendererContainerInstance

// 特别强调该模块的构建依赖挂载在iframe上的Host模块所以禁止在iframe注入前调用该模块不然会被挂载到父亲window上（建议不要在该模块export任何模块防止错误调用）
