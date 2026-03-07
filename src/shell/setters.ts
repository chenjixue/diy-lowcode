import {Setters as InnerSetters} from "@/editor/setters.ts";
import {ReactNode} from "react";

const settersSymbol = Symbol('setters');
const innerSettersSymbol = Symbol('setters');

export class Setters {
    readonly [innerSettersSymbol]: InnerSetters;
    get [settersSymbol]() {
        return this[innerSettersSymbol];
    }

    constructor(innerSetters: InnerSetters, readonly workspaceMode = false) {
        this[innerSettersSymbol] = innerSetters;
    }

    createSetterContent = (setter: any, props: Record<string, any>): ReactNode => {
        return this[settersSymbol].createSetterContent(setter, props);
    };
    getSetter = (type: string) => {
        return this[settersSymbol].getSetter(type);
    };
    getSettersMap = () => {
        return this[settersSymbol].getSettersMap();
    }
    registerSetter = (
        typeOrMaps: any,
        setter?: any,
    ) => {
        return this[settersSymbol].registerSetter(typeOrMaps, setter);
    };
}
