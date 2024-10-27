import { ReactNode, createElement, ReactInstance } from "react";
import { IWidget } from "./area";
import { PanelDockConfig, Skeleton } from "./editor-skeleton";
import { composeTitle, PanelDockView, WidgetView } from "./componets/widget-views";
import { Panel } from './panel';
import { computed } from "mobx";

export class PanelDock implements IWidget {
    readonly name: string;
    //外界用于判断是否是PaneDock
    readonly isPanelDock = true;
    private _body: ReactNode;
    private inited = false;
    readonly panelName: string;
    private _shell: ReactInstance | null = null;
    private _panel?: Panel;
    constructor(readonly skeleton: Skeleton, readonly config: PanelDockConfig) {
        const { content, contentProps, panelProps, name, props } = config
        this.name = name
        this.panelName = config.panelName || name;
        if (content) {
            this._panel = this.skeleton.add({
                type: 'Panel',
                name: this.panelName,
                props: panelProps,
                contentProps,
                content,
                area: panelProps?.area,
            }) as Panel;
        }
    }
    @computed get panel() {
        return this._panel || this.skeleton.getPanel(this.panelName);
    }
    get body() {
        if (this.inited) {
            return this._body;
        }
        this.inited = true;
        const { props } = this.config;

        this._body = createElement(PanelDockView, {
            ...props,
            dock: this,
        });
        return this._body;
    }
    togglePanel() {
        this.panel?.toggle();
    }
    get content(): ReactNode {
        return createElement(WidgetView, {
            widget: this,
            ref: (ref) => {
                this._shell = ref;
            },
            key: this.id,
        });
    }
    /**
    * @deprecated
    */
    onActiveChange(func: () => any) {
        return this.panel?.onActiveChange(func);
    }
}