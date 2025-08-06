import { Skeleton } from "./editor-skeleton";
import { IPublicTypeWidgetBaseConfig } from "./types";
import { WidgetContainer } from "./widget-container";
import { computed, observable, makeObservable } from "mobx";
import {createElement, ReactNode} from "react";
import {WidgetView} from "@/core/componets/widget-views.tsx";
import {createContent} from "@/util/create-content.ts";
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
    private _body: ReactNode;
    get body() {
        // if (this.inited) {
        //     return this._body;
        // }
        // this.inited = true;
        const { content, contentProps } = this.config;
        this._body = createContent(content, {
            ...contentProps,
            config: this.config,
            // editor: getEvent(this.skeleton.editor),
        });
        return this._body;
    }
    get content(): ReactNode {
        return createElement(WidgetView, {
            widget: this,
        });
    }
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
      const item = this.container.get(config.name);
      if (item) {
        return item;
      }
        return this.container.add(config)
    }
    remove(config: T | string): number {
      return this.container.remove(config);
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
