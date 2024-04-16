import { Skeleton } from "./editor-skeleton";
import { IPublicTypeWidgetBaseConfig } from "./types";
import { WidgetContainer } from "./widget-container";

export interface IArea<C, T> {
    add(config: T): T;
}
export interface IWidget {
    readonly name: string,
    readonly skeleton: Skeleton;
}
export interface WidgetConfig extends IPublicTypeWidgetBaseConfig {
    type: 'Widget';
    content?: object
}
export class Widget implements IWidget {
    readonly name: string;
    constructor(readonly skeleton: Skeleton, readonly config: WidgetConfig) {
        const { name } = config
        this.name = name
    }
}
export class Area<C extends IPublicTypeWidgetBaseConfig = any, T extends IWidget = IWidget> implements IArea<C, T>{
    readonly container: WidgetContainer<T>
    constructor(readonly skeleton: Skeleton, readonly name: string, handle: (item: T) => T) {
        this.container = skeleton.createContainer(name, handle)
    }
    add(config: T): T {
        return this.container.add(config)
    }
}