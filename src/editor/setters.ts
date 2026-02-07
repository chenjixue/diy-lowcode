import {ReactNode} from "react";
import {createContent} from "@/util/create-content.ts";

export class Setters {
    settersMap = new Map();

    constructor(readonly viewName: string = 'global') {
    }

    getSetter = (type: string) => {
        return this.settersMap.get(type) || null;
    };

    registerSetter = (
        typeOrMaps: any,
        setter?: any,
    ) => {
        if (typeof typeOrMaps === 'object') {
            Object.keys(typeOrMaps).forEach(type => {
                this.registerSetter(type, typeOrMaps[type]);
            });
            return;
        }
        if (!setter) {
            return;
        }
        this.settersMap.set(typeOrMaps, {type: typeOrMaps, ...setter});
    };

    getSettersMap = () => {
        return this.settersMap;
    };

    createSetterContent = (setter: any, props: Record<string, any>): ReactNode => {
        if (typeof setter === 'string') {
            setter = this.getSetter(setter);
            if (!setter) {
                return null;
            }
            if (setter.defaultProps) {
                props = {
                    ...setter.defaultProps,
                    ...props,
                };
            }
            setter = setter.component;
        }

        // Fusion 的表单组件都是通过 'value' in props 来判断是否使用 defaultValue
        if ('value' in props && typeof props.value === 'undefined') {
            delete props.value;
        }

        return createContent(setter, props);
    };
}
