import { Skeleton } from "../editor-skeleton";

export interface IPublicTypeWidgetBaseConfig {
    [extra: string]: any;
    name: string,
    skeleton: Skeleton;
    content?: Object
}
export type IPublicTypeWidgetConfigArea = 'leftArea' | 'left' | 'rightArea' |
    'right' | 'topArea' | 'subTopArea' | 'top' |
    'toolbar' | 'mainArea' | 'main' |
    'center' | 'centerArea' | 'bottomArea' |
    'bottom' | 'leftFixedArea' |
    'leftFloatArea' | 'stages';
export interface IPublicTypePanelDockPanelProps {
    [key: string]: any;

    /** 是否隐藏面板顶部条 */
    hideTitleBar?: boolean;

    width?: number;

    height?: number;

    maxWidth?: number;

    maxHeight?: number;

    area?: IPublicTypeWidgetConfigArea;
}
export interface IPublicTypePanelDockConfig extends IPublicTypeWidgetBaseConfig {
    type: 'PanelDock';
    panelProps?: IPublicTypePanelDockPanelProps;
}
export type IPublicTypeSkeletonConfig = IPublicTypePanelDockConfig | IPublicTypeWidgetBaseConfig;
export interface IPublicApiSkeleton {

    /**
     * 增加一个面板实例
     * add a new panel
     * @param config
     * @param extraConfig
     * @returns
     */
    add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): any;
}
export interface ILowCodePluginContextPrivate {
    set skeleton(skeleton: IPublicApiSkeleton);
}