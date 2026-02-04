import {SettingTopEntry} from "@/designer/setting/setting-top-entry.ts";
import {makeObservable, observable} from "mobx";

export class SettingField {
    parent: SettingTopEntry | SettingField;
    private _config
    private _setter
    readonly transducer: any;
    private _title?: any;
    private _name?: any;
    @observable.ref private _expanded = true;
    private _items: Array<any> = [];

    get title() {
        return (
            this._title
        );
    }

    get items(): Array<any> {
        return this._items;
    }

    get name() {
        return this._name;
    }

    constructor(
        parent: SettingTopEntry,
        config,
        private settingFieldCollector?: (name: string | number, field: SettingField) => void,
    ) {
        makeObservable(this);
        const {title, items, setter, extraProps, ...rest} = config;
        this.parent = parent;
        this._config = config;
        this._title = title;
        this._setter = setter;
        this._name = config.name;
        // this.transducer = new Transducer(this, {setter});
        if (items && items.length > 0) {
            this.initItems(items, this.settingFieldCollector);
        }
    }

    private initItems(
        items: Array<any>,
        settingFieldCollector?: any,
    ) {
        this._items = items.map((item) => {
            return new SettingField(this, item, settingFieldCollector);
        });
    }
}
