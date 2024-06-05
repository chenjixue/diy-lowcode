import { ReactNode, createElement,ReactInstance} from "react";
import { IWidget } from "./area";
import { PanelDockConfig, Skeleton } from "./editor-skeleton";
import { PanelDockView, WidgetView } from "./componets/widget-views";

export class PanelDock implements IWidget {
    readonly name: string;
    private _body: ReactNode;
    private inited = false;
    private _shell: ReactInstance | null = null;
    constructor(readonly skeleton: Skeleton, readonly config: PanelDockConfig) {
        const { name } = config
        this.name = name
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
    get content(): ReactNode {
        return createElement(WidgetView, {
            widget: this,
            ref: (ref) => {
                this._shell = ref;
            },
            key: this.id,
        });
    }
}