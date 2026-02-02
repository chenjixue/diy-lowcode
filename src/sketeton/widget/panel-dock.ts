import {ReactNode, createElement, ReactInstance} from "react";
import {IWidget} from "../area.ts";
import {PanelDockConfig, Skeleton} from "../skeleton.ts";
import {WidgetView} from "./widget-views.tsx";
import {Panel} from './panel';
import {computed, makeObservable, observable} from "mobx";
import {PanelDockView} from "@/sketeton/widget/panel-dock-view.tsx";

export class PanelDock implements IWidget {
    readonly name: string;
    //外界用于判断是否是PaneDock
    readonly isPanelDock = true;
    private _body: ReactNode;
    private inited = false;
    readonly panelName: string;
    private id: string;
    private _shell: ReactInstance | null = null;
    @observable _panel?: Panel;

    constructor(readonly skeleton: Skeleton, readonly config: PanelDockConfig) {
        makeObservable(this);
        const {content, contentProps, panelProps, name, props} = config
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

    @computed get actived(): boolean {
        return this.panel?.visible || false;
    }

    @computed get panel() {
        return this._panel || this.skeleton.getPanel(this.panelName);
    }

    get body() {
        if (this.inited) {
            return this._body;
        }
        this.inited = true;
        const {props} = this.config;

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
