import {isObject} from "lodash";

export function isInnerJsFunction(data) {
    if (!isObject(data)) {
        return false;
    }
    return data.type === 'JSExpression' && data.extType === 'function';
}

export function isJSFunction(data) {
    if (!isObject(data)) {
        return false;
    }
    return data.type === 'JSFunction' || isInnerJsFunction(data);
}
