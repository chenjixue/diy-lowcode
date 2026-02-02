import {Skeleton} from "@/sketeton/skeleton.ts";
import {IPublicTypeWidgetBaseConfig} from "@/types";
import {createElement, ReactNode} from "react";
import {createContent} from "@/util/create-content.ts";
import {WidgetView} from "@/sketeton/widget/widget-views.tsx";

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
    private _body: ReactNode;
    get body() {
        // if (this.inited) {
        //     return this._body;
        // }
        // this.inited = true;
        const { content, contentProps } = this.config;
        this._body = createContent(content, {
            ...contentProps,
            config: this.config,
            // editor: getEvent(this.skeleton.editor),
        });
        return this._body;
    }
    get content(): ReactNode {
        return createElement(WidgetView, {
            widget: this,
        });
    }
    constructor(readonly skeleton: Skeleton, readonly config: WidgetConfig) {
        const { name } = config
        this.name = name
    }
}
