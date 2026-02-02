import {Skeleton} from "./skeleton.ts";
import {IPublicTypeWidgetBaseConfig} from "../types";
import {WidgetContainer} from "./widget-container.ts";
import {computed, observable, makeObservable} from "mobx";
import {IWidget} from "@/sketeton/widget/widget.ts";

export interface IArea<C, T> {
    add(config: T): T;
}

export class Area<C extends IPublicTypeWidgetBaseConfig = any, T extends IWidget = IWidget> implements IArea<C, T> {
    @computed get visible() {
        if (this.exclusive) {
            return this.container.current != null;
        }
        return this._visible;
    }
    private lastCurrent: T | null = null;
    @observable private _visible = true;

    readonly container: WidgetContainer<T>

    constructor(readonly skeleton: Skeleton, readonly name: string, handle: (item: T) => T, private exclusive?: boolean, defaultSetCurrent = false) {
        makeObservable(this)
        this.container = skeleton.createContainer(name, handle, exclusive, () => this.visible, defaultSetCurrent)
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
            const {current} = this.container;
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
        console.log(this.name, "this.name--")
        return this.container.items.length < 1;
    }
}
