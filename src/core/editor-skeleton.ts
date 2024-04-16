import { IWidget, Area, Widget, WidgetConfig } from "@/core/area"
import { WidgetContainer } from "./widget-container";
import { IPublicTypeWidgetBaseConfig } from "./types";
import { PanelDock } from "./panel-dock";
import { Dock } from "./dock";
import { Panel } from "./pane";
export interface DockConfig extends IDockBaseConfig {
    type: 'Dock';
    content?: Object
}

export interface IDockBaseConfig extends IPublicTypeWidgetBaseConfig {
}
export interface PanelConfig extends IPublicTypeWidgetBaseConfig {
    type: 'Panel';
    content?: Object;
}
export interface PanelDockConfig extends IDockBaseConfig {
    type: 'PanelDock';
    panelName?: string;
}
export interface DividerConfig extends IPublicTypeWidgetBaseConfig {
    type: 'Divider'
}
export function isDockConfig(obj: any): obj is DockConfig {
    return obj && /Dock$/.test(obj.type);
}
export function isPanelConfig(obj: any): obj is PanelConfig {
    return obj && obj.type === 'Panel';
}
export function isPanelDockConfig(obj: any): obj is PanelDockConfig {
    return obj && obj.type === 'PanelDock';
}
export function isDividerConfig(obj: any): obj is DividerConfig {
    return obj && obj.type === 'Divider';
}
export interface PanelDockConfig extends IDockBaseConfig {
    type: 'PanelDock';
    panelName?: string;
    content?: object
}

export class Skeleton {
    readonly leftArea;
    constructor() {
        this.leftArea = new Area(this, "leftArea", (config) => {
            return this.createWidget(config)
        })
    };
    private parseConfig(config: IPublicTypeWidgetBaseConfig) {
        const { content, ...restConfig } = config;
        restConfig.pluginKey = restConfig.name;
        return restConfig;

    }
    createPanel(config: PanelConfig) {
        const parsedConfig = this.parseConfig(config);
        const panel = new Panel(this, parsedConfig as PanelConfig);
        return panel;
    };
    createWidget(config: IPublicTypeWidgetBaseConfig) {
        config = this.parseConfig(config);
        let widget: IWidget;
        if (isDockConfig(config)) {
            if (isPanelDockConfig(config)) {
                widget = new PanelDock(this, config);
            } else if (false) {
                // DialogDock
                // others...
            } else {
                widget = new Dock(this, config);
            }
        } else if (isDividerConfig(config)) {
            widget = new Widget(this, {
                ...config,
                type: 'Widget',
                // content: Divider,
            });
        } else if (isPanelConfig(config)) {
            widget = this.createPanel(config);
        } else {
            widget = new Widget(this, config as WidgetConfig);
        }
        return widget;
    }
    createContainer<T extends IWidget>(name: string, handle: (item: T) => T) {
        const container = new WidgetContainer(name, handle)
        return container
    }
}