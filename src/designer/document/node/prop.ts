import { action, makeObservable, observable, runInAction } from "mobx";
import { IPublicEnumTransformStage } from "../../../types";
export const UNSET = Symbol.for('unset');
// eslint-disable-next-line no-redeclare
export type UNSET = typeof UNSET;

export default class Prop {
    @observable.ref private _type = 'unset';
    @observable private _value: any = UNSET;
    @observable key: string | number | undefined;
    @observable.shallow private _maps: any = null;
    @observable.shallow private _items: any = null;
    readonly props;
    readonly owner;
    constructor(
        public parent: any,
        value = UNSET,
        key?: string | number,
        spread = false,
        options = {},
    ) {
        makeObservable(this);
        this.owner = parent.owner;
        this.props = parent.props;
        this.key = key;
        if (value !== UNSET) {
            this.setValue(value);
        }
        this.setupItems();
    }
    @action setValue(val: any) {
        this._value = val;
        const t = typeof val;
        if (val == null) {
            this._type = 'literal'
        } else if (t === 'string' || t === 'number' || t === 'boolean') {
            this._type = 'literal';
        } else {
            this._type = 'map';
        }
        this.setupItems();
    }
    @action
    setupItems() {
        return this.items;
    }
    @action
    // get(path: string | number, createIfNone = true): Prop | null {
    //     const type = this._type;
    //     if (type !== 'map' && type !== 'list' && type !== 'unset' && !createIfNone) {
    //         return null;
    //     }
    //
    //     const maps = type === 'map' ? this.maps : null;
    //     const items = type === 'list' ? this.items : null;
    //
    //     let entry = path;
    //     let nest = '';
    //     if (typeof path !== 'number') {
    //         const i = path.indexOf('.');
    //         if (i > 0) {
    //             nest = path.slice(i + 1);
    //             if (nest) {
    //                 entry = path.slice(0, i);
    //             }
    //         }
    //     }
    //
    //     let prop: any;
    //     if (type === 'list') {
    //         if (isValidArrayIndex(entry, this.size)) {
    //             prop = items![entry];
    //         }
    //     } else if (type === 'map') {
    //         prop = maps?.get(entry);
    //     }
    //
    //     if (prop) {
    //         return nest ? prop.get(nest, createIfNone) : prop;
    //     }
    //
    //     if (createIfNone) {
    //         prop = new Prop(this, UNSET, entry);
    //         this.set(entry, prop, true);
    //         if (nest) {
    //             return prop.get(nest, true);
    //         }
    //
    //         return prop;
    //     }
    //
    //     return null;
    // }
    private get items() {
        return runInAction(() => {
            let items: any[] | null = null;
            if (this._type === 'map') {
                const data = this._value;
                const maps = new Map();
                const keys = Object.keys(data);
                for (const key of keys) {
                    let prop: any;
                    if (this._maps?.has(key)) {
                        prop = this._maps.get(key)!;
                        prop.setValue(data[key]);
                    } else {
                        prop = new Prop(this, data[key], key);
                    }
                    items = items || [];
                    items.push(prop); maps.set(key, prop);
                }
                this._maps = maps;
            } else {
                items = null;
                this._maps = null;
            }
            this._items = items;
            return this._items;
        })
    }
    export(stage = IPublicEnumTransformStage.Save) {
        const type = this._type;
        if (type === 'unset') {
            return undefined;
        }
        if (type === 'literal' || type === 'expression') {
            return this._value;
        }
        if (type === 'map') {
            if (!this._items) {
                return this._value;
            }
            let maps: any; this.items!.forEach((prop, key) => {
                if (!prop.isUnset()) {
                    const v = prop.export(stage);
                    if (v != null) {
                        maps = maps || {};
                        maps[prop.key || key] = v;
                    }
                }
            });
            return maps;
        }
    }
    @action
    isUnset() {
        return this._type === 'unset';
    }
}
