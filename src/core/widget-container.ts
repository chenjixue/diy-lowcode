import { isPanel } from "./pane";
import { computed, observable, makeObservable } from "mobx";

export interface WidgetItem {
    name: string
}
export interface Activeable {
    setActive(flag: boolean): void;
}
function isActiveable(obj: any): obj is Activeable {
    return obj && obj.setActive;
}
export class WidgetContainer<T extends WidgetItem = any> {
    items: T[] = [];
    private maps: { [name: string]: T } = {};
    @observable.ref private _current: T & Activeable | null = null;
    @computed get current() {
        return this._current;
      }
    @computed get visible() {
      debugger
      return this.checkVisible();
    }
    constructor(readonly name: string, private handle: (item: T) => T, private exclusive: boolean = false,private checkVisible: () => boolean = () => true) {
        makeObservable(this)
    }
    add(item: T): T {
        item = this.handle(item)
        const origin = this.get(item.name);
        if (origin === item) {
            return origin;
        }
        const i = origin ? this.items.indexOf(origin) : -1;
        if (i > -1) {
            this.items[i] = item;
        } else {
            this.items.push(item);
        }
        this.maps[item.name] = item;
        if (isPanel(item)) {
            item.setParent(this);
        }
        return item
    }

    remove(item: string | T): number {
        const thing = typeof item === 'string' ? this.get(item) : item;
        if (!thing) {
            return -1;
        }
        const i = this.items.indexOf(thing);
        if (i > -1) {
            this.items.splice(i, 1);
        }
        delete this.maps[thing.name];
        if (thing === this.current) {
            this._current = null;
        }
        return i;
    }
    active(nameOrItem?: T | string | null) {
        let item: any = nameOrItem;
        if (nameOrItem && typeof nameOrItem === 'string') {
            item = this.get(nameOrItem);
        }
        if (!isActiveable(item)) {
            item = null;
        }

        if (this.exclusive) {
            if (this._current === item) {
                return;
            }
            if (this._current) {
                this._current.setActive(false);
            }
            this._current = item;
        }

        if (item) {
            item.setActive(true);
        }
    }
    unactive(nameOrItem?: T | string | null) {
        let item: any = nameOrItem;
        if (nameOrItem && typeof nameOrItem === 'string') {
            item = this.get(nameOrItem);
        }
        if (!isActiveable(item)) {
            item = null;
        }
        if (this._current === item) {
            this._current = null;
        }
        if (item) {
            item.setActive(false);
        }
    }
    getAt(index: number): T | null {
        return this.items[index] || null;
    }
    get(name: string): T | null {
        return this.maps[name] || null;
    }
}