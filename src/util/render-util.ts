import React, { Component, createElement, forwardRef, FunctionComponent, ReactInstance } from 'react';
import { REACT_FORWARD_REF_TYPE } from '@/util/create-content';


const excludePropertyNames = [
    '$$typeof',
    'render',
    'defaultProps',
    'props',
    'length',
    'prototype',
    'name',
    'caller',
    'callee',
    'arguments',
];
export function cloneEnumerableProperty(target: any, origin: any, excludes = excludePropertyNames) {
    const compExtraPropertyNames = Object.keys(origin).filter(d => !excludes.includes(d));

    compExtraPropertyNames.forEach((d: string) => {
        (target as any)[d] = origin[d];
    });

    return target;
}
export function wrapReactClass(view: FunctionComponent) {
    let ViewComponentClass = class extends Component {
        render() {
            const { children, ...other } = this.props;
            return createElement(view, other, children);
        }
    } as any;
    ViewComponentClass = cloneEnumerableProperty(ViewComponentClass, view);
    ViewComponentClass.displayName = view.displayName;
    return ViewComponentClass;
}
export function acceptsRef(obj: any): boolean {
    if (!obj) {
        return false;
    }
    if (obj?.prototype?.isReactComponent || isForwardOrMemoForward(obj)) {
        return true;
    }

    return false;
}
export function isForwardRefType(obj: any): boolean {
    if (!obj || !obj?.$$typeof) {
        return false;
    }
    return obj?.$$typeof === REACT_FORWARD_REF_TYPE;
}
export function isForwardOrMemoForward(obj: any): boolean {
    if (!obj || !obj?.$$typeof) {
        return false;
    }
    return (
        // React.forwardRef(..)
        isForwardRefType(obj) ||
        // React.memo(React.forwardRef(..))
        (isMemoType(obj) && isForwardRefType(obj.type))
    );
}
const hasSymbol = typeof Symbol === 'function' && Symbol.for;
export const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
export function isMemoType(obj: any): boolean {
    if (!obj || !obj?.$$typeof) {
        return false;
    }
    return obj.$$typeof === REACT_MEMO_TYPE;
}
export function getSubComponent(library: any, paths: string[]) {
    const l = paths.length;
    if (l < 1 || !library) {
        return library;
    }
    let i = 0;
    let component: any;
    while (i < l) {
        const key = paths[i]!;
        let ex: any;
        try {
            component = library[key] || component;
        } catch (e) {
            ex = e;
            component = null;
        }
        if (i === 0 && component == null && key === 'default') {
            if (ex) {
                return l === 1 ? library : null;
            }
            component = library;
        } else if (component == null) {
            return null;
        }
        library = component;
        i++;
    }
    return component;
}
export function accessLibrary(library: string | Record<string, unknown>) {
    if (typeof library !== 'string') {
        return library;
    }

    return (window as any)[library] || generateHtmlComp(library);
}
export function generateHtmlComp(library: string) {
    if (['a', 'img', 'div', 'span', 'svg'].includes(library)) {
        return forwardRef((props, ref) => {
            return createElement(library, { ref, ...props }, props.children);
        });
    }
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
export function isReactComponent(obj: any): obj is ComponentType<any> {
    if (!obj) {
        return false;
    }

    return Boolean(isReactClass(obj) || typeof obj === 'function' || isForwardRefType(obj) || isMemoType(obj));
}
export type ESModule = {
    __esModule: true;
    default: any;
};
export function isESModule(obj: any): obj is ESModule {
    return obj && obj.__esModule;
}

function findComponent(libraryMap: LibraryMap, componentName: string, npm?: IPublicTypeNpmInfo) {
    if (!npm) {
        return accessLibrary(componentName);
    }
    // libraryName the key access to global
    // export { exportName } from xxx exportName === global.libraryName.exportName
    // export exportName from xxx   exportName === global.libraryName.default || global.libraryName
    // export { exportName as componentName } from package
    // if exportName == null exportName === componentName;
    // const componentName = exportName.subName, if exportName empty subName donot use
    const exportName = npm.exportName || npm.componentName || componentName;
    const libraryName = libraryMap[npm.package] || exportName;
    const library = accessLibrary(libraryName);
    const paths = npm.exportName && npm.subName ? npm.subName.split('.') : [];
    if (npm.destructuring) {
        paths.unshift(exportName);
    } else if (isESModule(library)) {
        paths.unshift('default');
    }
    return getSubComponent(library, paths);
}
export function buildComponents(libraryMap, componentsMap, createComponent) {
    const components: any = {};
    Object.keys(componentsMap).forEach((componentName) => {
        let component = componentsMap[componentName];
        component = findComponent(libraryMap, componentName, component);
        if (component) {
            if (!acceptsRef(component) && isReactComponent(component)) {
                component = wrapReactClass(component as FunctionComponent);
            }
            components[componentName] = component;
        }
    });
    return components;
}