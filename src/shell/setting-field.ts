export const settingFieldSymbol = Symbol('settingField');

export default class SettingField {
    private readonly [settingFieldSymbol]

    constructor(prop: SettingField) {
        this[settingFieldSymbol] = prop;
    }

    static create(prop: SettingField) {
        return new SettingField(prop);
    }

    getValue(): any {
        return this[settingFieldSymbol].getValue();
    }
}
