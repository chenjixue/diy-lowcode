// import { IPublicEnumTransformStage } from "../react-simulator-renderer/renderer";

import {IPublicEnumTransformStage} from "../../../types";
import {action, computed, makeObservable, observable} from "mobx";
import Prop from "./prop.ts"
export const UNSET = Symbol.for('unset');
export class Props {
    readonly owner;
    @observable.shallow private items: any[] = [];

    constructor(owner: any, value?: any, extras?: any) {
        this.owner = owner;
        this.items = Object.keys(value).map((key) => new Prop(this, value[key], key, false));
    }

    @computed private get maps(): Map<string, Prop> {
        const maps = new Map();
        if (this.items.length > 0) {
            this.items.forEach((prop) => {
                if (prop.key) {
                    maps.set(prop.key, prop);
                }
            });
        }
        return maps;
    }

    export(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Save) {
        if (this.items.length < 1) {
            return {};
        }
        let allProps = {} as any;
        // let props: any = {};
        // const extras: any = {};
        this.items.forEach((item) => {
            let name = item.key as string;
            let value = item.export(stage);
            if (value != null) {
                allProps[name] = value;

            }
        });

        return {props: allProps};
    }

    @action
    getProp(path: string, createIfNone = true) {
        return this.query(path, createIfNone) || null;
    }

    @action
    query(path: string, createIfNone = true) {
        return this.get(path, createIfNone);
    }

    @action
    get(path: string, createIfNone = false) {
        let entry = path;
        let nest = '';
        const i = path.indexOf('.');
        if (i > 0) {
            nest = path.slice(i + 1);
            if (nest) {
                entry = path.slice(0, i);
            }
        }

        let prop = this.maps.get(entry);
        if (!prop && createIfNone) {
            prop = new Prop(this, UNSET, entry);
            this.items.push(prop);
        }

        if (prop) {
            return nest ? prop.get(nest, createIfNone) : prop;
        }

        return null;
    }
}
