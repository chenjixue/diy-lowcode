import {Editor} from "@/editor-core/editor.ts";
import {SettingField} from "@/designer/setting/setting-field.ts";
import {computed, observable} from "mobx";

export class SettingTopEntry {
    private _settingFieldMap = {};
    private _componentMeta
    private _items = [];
    readonly path = [];
    @observable.ref _first

    get componentMeta() {
        return this._componentMeta;
    }

    @computed get first() {
        return this._first;
    }

    get items() {
        return this._items;
    }

    constructor(readonly editor: Editor, readonly nodes: []) {
        this._first = nodes[0];
        this.setupComponentMeta();
        this.setupItems();
    }

    private setupComponentMeta() {
        const {first} = this;
        const meta = first?.componentMeta;
        this._componentMeta = meta;
    }

    getPropValue(propName: string | number): any {
        return this.first?.getProp(propName.toString(), true)?.getValue();
    }

    private setupItems() {
        if (this.componentMeta) {
            const settingFieldMap = {};
            const settingFieldCollector = (name: string | number, field) => {
                settingFieldMap[name] = field;
            };
            this._items = this.componentMeta.configure.map((item) => {
                return new SettingField(this, item as any, settingFieldCollector);
            });
            this._settingFieldMap = settingFieldMap;
        }
    }

    private setupEvents() {
        return this.componentMeta?.onMetadataChange(() => {
            this.setupItems();
        });
    }
}
