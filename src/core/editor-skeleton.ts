import { IWidget, Area, Widget, WidgetConfig } from "@/core/area"
import { isValidElement } from 'react';
import { WidgetContainer } from "./widget-container";
import { IPublicTypeWidgetBaseConfig } from "./types";
import { PanelDock } from "./panel-dock";
import { Dock } from "./dock";
import { isPanel, Panel } from "./pane";
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
export function isObject(value: any): value is Record<string, unknown> {
    return value !== null && typeof value === 'object';
}


export class Skeleton {
    readonly leftArea;
    readonly leftFloatArea;
    private panels = new Map<string, Panel>();
    constructor() {
        this.leftArea = new Area(this, "leftArea", (config) => {
            return this.createWidget(config)
        })
        this.leftFloatArea = new Area(
            this,
            'leftFloatArea',
            (config) => {
                if (isPanel(config)) {
                    return config;
                }
                return this.createPanel(config);
            },
            true,
        );
    };
    private parseConfig(config: IPublicTypeWidgetBaseConfig) {
        if (config.parsed) {
            return config;
        }
        const { content, ...restConfig } = config;
        if (content) {
            if (isObject(content) && !isValidElement(content)) {
                Object.keys(content).forEach((key) => {
                    if (/props$/i.test(key) && restConfig[key]) {
                        restConfig[key] = {
                            ...restConfig[key],
                            ...content[key],
                        };
                    } else {
                        restConfig[key] = content[key];
                    }
                });
            } else {
                restConfig.content = content;
            }
        }
        restConfig.pluginKey = restConfig.name;
        restConfig.parsed = true;
        return restConfig;

    }
    createPanel(config: PanelConfig) {
        const parsedConfig = this.parseConfig(config);
        const panel = new Panel(this, parsedConfig as PanelConfig);
        this.panels.set(panel.name, panel);
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
    createContainer<T extends IWidget>(name: string, handle: (item: T) => T, exclusive = false,) {
        const container = new WidgetContainer(name, handle,exclusive)
        return container
    }
    getPanel(name: string): Panel | undefined {
        return this.panels.get(name);
    }
    add(config: IPublicTypeSkeletonConfig) {
        const parsedConfig = {
            ...this.parseConfig(config),
        };
        let { area } = parsedConfig;
        if (!area) {
            if (parsedConfig.type === 'Panel') {
                area = 'leftFloatArea';
            } else if (parsedConfig.type === 'Widget') {
                area = 'mainArea';
            } else {
                area = 'leftArea';
            }
        }
        switch (area) {
            case 'leftArea':
            case 'left':
                return this.leftArea.add(parsedConfig as PanelDockConfig);
            // case 'rightArea':
            // case 'right':
            //     return this.rightArea.add(parsedConfig as PanelConfig);
            // case 'topArea':
            // case 'top':
            //     return this.topArea.add(parsedConfig as PanelDockConfig);
            // case 'subTopArea':
            //     return this.subTopArea.add(parsedConfig as PanelDockConfig);
            // case 'toolbar':
            //     return this.toolbar.add(parsedConfig as PanelDockConfig);
            // case 'mainArea':
            // case 'main':
            // case 'center':
            // case 'centerArea':
            //     return this.mainArea.add(parsedConfig as PanelConfig);
            // case 'bottomArea':
            // case 'bottom':
            //     return this.bottomArea.add(parsedConfig as PanelConfig);
            // case 'leftFixedArea':
            //     return this.leftFixedArea.add(parsedConfig as PanelConfig);
            case 'leftFloatArea':
                return this.leftFloatArea.add(parsedConfig as PanelConfig);
            // case 'stages':
            //     return this.stages.add(parsedConfig as StageConfig);
            default:
            // do nothing
        }
    }
}