import {SettingTopEntry} from "@/designer/setting/setting-top-entry.ts";
import {makeObservable, observable} from "mobx";
import {SettingPropEntry} from "@/designer/setting/setting-prop-entry.ts";

export class SettingField extends SettingPropEntry {
    parent: SettingTopEntry | SettingField;
    private _config
    private _setter
    readonly transducer: any;
    private _title?: any;
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



    constructor(
        parent: SettingTopEntry,
        config,
        private settingFieldCollector?: (name: string | number, field: SettingField) => void,
    ) {
        super(parent, config.name, config.type)
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

    internalToShellField() {
        return this.designer!.shellModelFactory.createSettingField(this);
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
