import {isObject} from "@/util/is-object.ts"

export function isPlainObject(value) {
    if (!isObject(value)) {
        return false;
    }
    let proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null;
}
