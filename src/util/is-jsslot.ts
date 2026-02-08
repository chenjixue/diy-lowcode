import {isObject} from "lodash";

export function isJSSlot(data) {
    if (!isObject(data)) {
        return false;
    }
    return data.type === 'JSSlot';
}
