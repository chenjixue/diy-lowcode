import { isValidElement, ReactNode, createElement, cloneElement, Component, ComponentType, ComponentClass,ReactElement} from 'react';
const hasSymbol = typeof Symbol === 'function' && Symbol.for;
const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
const URL_RE = /^(https?:)\/\//i;
function isForwardRefType(obj: any): boolean {
  return obj?.$$typeof && obj?.$$typeof === REACT_FORWARD_REF_TYPE;
}
export function isReactComponent(obj: any): obj is ComponentType<any> {
  return obj && (isReactClass(obj) || typeof obj === 'function' || isForwardRefType(obj));
}
export function isReactClass(obj: any): obj is ComponentClass<any> {
  return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}
export type ESModule = {
  __esModule: true;
  default: any;
};
export function isESModule(obj: any): obj is ESModule {
  return obj && obj.__esModule;
}
export type IPublicTypeIconType = ReactElement
export function createIcon(
  icon?: IPublicTypeIconType | null,
  props?: Record<string, unknown>,
): ReactNode {
  if (!icon) {
    return null;
  }
  if (isESModule(icon)) {
    icon = icon.default;
  }
  if (typeof icon === 'string') {
    if (URL_RE.test(icon)) {
      return <img src={icon} {...props} />;
    }
    // return <Icon type={icon} {...props} />;
  }
  if (isValidElement(icon)) {
    return cloneElement(icon, { ...props });
  }
  if (isReactComponent(icon)) {

    return createElement(icon, { ...props });
  }
}
