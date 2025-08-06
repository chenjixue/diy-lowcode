import React, { createElement, ReactInstance } from 'react';
import { render as reactRender } from 'react-dom';
// import { BuiltinSimulatorHost } from '@/core/host/host.tsx';
import { computed, makeObservable, observable, observe } from "mobx";
import { createMemoryHistory, MemoryHistory } from 'history';
import SimulatorRendererView from "@/core/react-simulator-renderer/renderer-view.tsx"
import { host } from '../host';
export class DocumentInstance {
  instancesMap = new Map<string, ReactInstance[]>();

  get schema(): any {
    return this.document.export(IPublicEnumTransformStage.Render);
  }

  private disposeFunctions: Array<() => void> = [];

  @observable.ref private _components: any = {};

  @computed get components(): object {
    // 根据 device 选择不同组件，进行响应式
    // 更好的做法是，根据 device 选择加载不同的组件资源，甚至是 simulatorUrl
    return this._components;
  }

  // context from: utils、constants、history、location、match
  @observable.ref private _appContext = {};

  @computed get context(): any {
    return this._appContext;
  }

  @observable.ref private _designMode = 'design';

  @computed get designMode(): any {
    return this._designMode;
  }

  @observable.ref private _requestHandlersMap = null;

  @computed get requestHandlersMap(): any {
    return this._requestHandlersMap;
  }

  @observable.ref private _device = 'default';

  @computed get device() {
    return this._device;
  }

  @observable.ref private _componentsMap = {};

  @computed get componentsMap(): any {
    return this._componentsMap;
  }

  @computed get suspended(): any {
    return false;
  }

  @computed get scope(): any {
    return null;
  }

  get path(): string {
    return `/${this.document.fileName}`;
  }

  get id() {
    return this.document.id;
  }

  constructor(readonly container: SimulatorRendererContainer, readonly document: IDocumentModel) {
    makeObservable(this);
  }
}
export class SimulatorRendererContainer implements BuiltinSimulatorRenderer {
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
    // this.disposeFunctions.push(host.connect(this, () => {
    //   // sync layout config
    //   this._layout = host.project.get('config').layout;

    //   // todo: split with others, not all should recompute
    //   if (this._libraryMap !== host.libraryMap
    //     || this._componentsMap !== host.designer.componentsMap) {
    //     this._libraryMap = host.libraryMap || {};
    //     this._componentsMap = host.designer.componentsMap;
    //     // this.buildComponents();
    //   }
    // }));
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

    reactRender(createElement(SimulatorRendererView, { rendererContainer: this }), container);
    // host.project.setRendererReady(this);
  }
}
export default new SimulatorRendererContainer();