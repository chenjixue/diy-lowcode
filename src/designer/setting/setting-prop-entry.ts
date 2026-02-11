import {ComponentMeta} from '../component-meta';
import {Designer} from '../designer';
import {SettingTopEntry} from "@/designer/setting/setting-top-entry.ts";
import {Editor} from '@/editor/editor';
import {Setters} from '@/editor/setters.ts';
import {uniqueId} from "lodash";
import {SettingField} from './setting-field';
import {isJSExpression} from "@/util/asset.ts";
import Node from "@/designer/document/node/node.ts"
import {createModuleEventBus, EventBus} from "@/editor/event-bus.ts";
import {computed, makeObservable, observable} from "mobx";

export class SettingPropEntry {
    // === static properties ===
    readonly editor: Editor;

    readonly isSameComponent: boolean;

    readonly isMultiple: boolean;

    readonly isSingle: boolean;

    readonly setters: Setters;

    readonly nodes: Node[];

    readonly componentMeta: ComponentMeta | null;

    readonly designer: Designer | undefined;

    readonly top: SettingTopEntry;

    readonly isGroup: boolean;

    readonly type: 'field' | 'group';

    readonly id = uniqueId('entry');

    readonly emitter: EventBus = createModuleEventBus('SettingPropEntry');

    // ==== dynamic properties ====
    @observable.ref private _name: string | number | undefined;

    get name() {
        return this._name;
    }

    @computed get path() {
        const path = this.parent.path.slice();
        if (this.type === 'field' && this.name?.toString()) {
            path.push(this.name);
        }
        return path;
    }

    constructor(readonly parent: SettingTopEntry | SettingField, name: string | number | undefined, type?: 'field' | 'group') {
        makeObservable(this);
        this.designer = parent.designer;
        this.top = parent.top
    }

    /**
     * 获取当前属性值
     */
    getValue(): any {
        let val: any;
        if (this.type === 'field' && this.name?.toString()) {
            val = this.parent.getPropValue(this.name);
        }
        return val
    }

    getPropValue(propName: string | number): any {
        return this.top.getPropValue(this.path.concat(propName).join('.'));
    }

    getMockOrValue() {
        const v = this.getValue();
        if (isJSExpression(v)) {
            return v.mock;
        }
        return v;
    }

    internalToShellField() {
        return this.designer!.shellModelFactory.createSettingField(this);
    }
}
