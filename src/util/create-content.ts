import { ReactNode, ComponentType, isValidElement, cloneElement, createElement ,ComponentClass,Component} from 'react';
const hasSymbol = typeof Symbol === 'function' && Symbol.for;
export const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
export const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
export function isForwardRefType(obj: any): boolean {
    if (!obj || !obj?.$$typeof) {
        return false;
    }
    return obj?.$$typeof === REACT_FORWARD_REF_TYPE;
}
export function isReactClass(obj: any): obj is ComponentClass<any> {
    if (!obj) {
        return false;
    }
    if (obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component)) {
        return true;
    }
    return false;
}
export function isMemoType(obj: any): boolean {
    if (!obj || !obj?.$$typeof) {
        return false;
    }
    return obj.$$typeof === REACT_MEMO_TYPE;
}

export function isReactComponent(obj: any): obj is ComponentType<any> {
    if (!obj) {
        return false;
    }

    return Boolean(isReactClass(obj) || typeof obj === 'function' || isForwardRefType(obj) || isMemoType(obj));
}
export function createContent(
    content: ReactNode | ComponentType<any>,
    props?: Record<string, unknown>,
): ReactNode {
    if (isValidElement(content)) {
        return props ? cloneElement(content, props) : content;
    }
    if (isReactComponent(content)) {
        return createElement(content, props);
    }

    return content;
}
