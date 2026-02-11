import {isValidElement} from "react";
import {isReactComponent} from "@/util/render-util.ts";

export function isObject(value: any): value is Record<string, any> {
    return value !== null && typeof value === 'object';
}

export function isSetterConfig(obj) {
    if (!isObject(obj)) {
        return false;
    }
    return 'componentName' in obj && !isCustomView(obj);
}

export function isCustomView(obj: any) {
    if (!obj) {
        return false;
    }
    return isValidElement(obj) || isReactComponent(obj);
}
