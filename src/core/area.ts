import { Skeleton } from "./editor-skeleton";
import { IPublicTypeWidgetBaseConfig } from "./types";
import { WidgetContainer } from "./widget-container";
import { computed, observable, makeObservable } from "mobx";
export interface IArea<C, T> {
    add(config: T): T;
}
export interface IWidget {
    readonly name: string,
    readonly skeleton: Skeleton;
}
export interface WidgetConfig extends IPublicTypeWidgetBaseConfig {
    type: 'Widget';
    content?: object
}
export class Widget implements IWidget {
    readonly name: string;
    constructor(readonly skeleton: Skeleton, readonly config: WidgetConfig) {
        const { name } = config
        this.name = name
    }
}
export class Area<C extends IPublicTypeWidgetBaseConfig = any, T extends IWidget = IWidget> implements IArea<C, T> {
    private lastCurrent: T | null = null;
    @observable private _visible = true;
    @computed get visible() {
        if (this.exclusive) {
          return this.container.current != null;
        }
        return this._visible;
      }
    readonly container: WidgetContainer<T>
    constructor(readonly skeleton: Skeleton, readonly name: string, handle: (item: T) => T, private exclusive?: boolean) {
        makeObservable(this)
        this.container = skeleton.createContainer(name, handle, exclusive)
    }
    add(config: T): T {
        return this.container.add(config)
    }
    setVisible(flag: boolean) {
        if (this.exclusive) {
          const { current } = this.container;
          if (flag && !current) {
            this.container.active(this.lastCurrent || this.container.getAt(0));
          } else if (current) {
            this.lastCurrent = current;
            this.container.unactive(current);
          }
          return;
        }
        this._visible = flag;
      }
    isEmpty(): boolean {
        return this.container.items.length < 1;
    }
}