import { ReactInstance } from "react";
import { IPublicEnumTransformStage } from "../types";
import { computed, makeObservable, observable } from "mobx";
import { SimulatorRendererContainer } from "./renderer";

export default class DocumentInstance {
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