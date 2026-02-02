// import { createModuleEventBus, IEventBus } from "@/eventBus/event-bus";
import {computed, makeObservable, observable} from "mobx";
import {PanelConfig, Skeleton} from "../skeleton.ts";
import {WidgetContainer} from "../widget-container.ts";
import {createElement, ReactNode} from "react";
import {TitledPanelView} from "@/sketeton/component/titled-panel-view.tsx";
import {IWidget} from "@/sketeton/widget/widget.ts";
import {createContent} from "@/util/create-content.ts";
import {PanelView} from "@/sketeton/widget/pane-view.tsx";

export function isPanel(obj: any): obj is Panel {
    return obj && obj.isPanel;
}

export interface Activeable {
    setActive(flag: boolean): void;
}

export class Panel implements IWidget {
    readonly isPanel = true;
    readonly name: string;
    public parent?: WidgetContainer;
    private id = ""
    @observable.ref inited = false;
    @observable.ref private _actived = false;
    private plain = false;

    @computed get visible(): boolean {
        if (!this.parent || this.parent.visible) {
            return this._actived;
        }
        return false;
    }

    get body() {
        const {content, contentProps} = this.config;
        return createContent(content, {
            ...contentProps,
            // editor: getEvent(this.skeleton.editor),
            config: this.config,
            panel: this,
            pane: this,
        });
    }

    constructor(readonly skeleton: Skeleton, readonly config: PanelConfig) {
        makeObservable(this)
        const {name, props = {}} = config;
        const {hideTitleBar, title} = props;
        this.plain = hideTitleBar || !title;
        this.name = name;
    }

    setParent(parent: WidgetContainer) {
        if (parent === this.parent) {
            return;
        }
        if (this.parent) {
            this.parent.remove(this);
        }
        this.parent = parent;
    }


    get content(): ReactNode {
        const area = this.config?.area || this.parent?.name;
        if (this.plain) {
            return createElement(PanelView, {
                panel: this,
                key: this.id,
                area,
            });
        }
        return createElement(TitledPanelView, {panel: this, key: this.id, area});
    }

    toggle() {
        this.setActive(!this._actived);
    }

    setActive(flag: boolean) {
        if (flag === this._actived) {
            // TODO: 如果移动到另外一个 container，会有问题
            return;
        }
        if (flag) {
            this._actived = true;
            this.parent?.active(this);
            if (!this.inited) {
                this.inited = true;
            }
        } else if (this.inited) {
            if (this.parent?.name && this.name.startsWith(this.parent.name)) {
                this.inited = false;
            }
            this._actived = false;
            this.parent?.unactive(this);
        }
    }
}
