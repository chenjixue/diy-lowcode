import SettingField from "@/shell/setting-field.ts";

class ShellModelFactory {
    createSettingField(prop: SettingField) {
        return SettingField.create(prop);
    }
}

export const shellModelFactory = new ShellModelFactory();
