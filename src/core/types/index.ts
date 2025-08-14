import { Skeleton } from "../editor-skeleton";

export interface IPublicTypeWidgetBaseConfig {
    [extra: string]: any;
    name: string,
    skeleton: Skeleton;
    content?: Object
}
export enum IPublicEnumTransformStage {
    Render = 'render',
    Serilize = 'serilize',
    Save = 'save',
    Clone = 'clone',
    Init = 'init',
    Upgrade = 'upgrade',
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
export enum AssetType {
    JSUrl = 'jsUrl',
    CSSUrl = 'cssUrl',
    CSSText = 'cssText',
    JSText = 'jsText',
    Bundle = 'bundle',
}
export enum AssetLevel {
    // 环境依赖库 比如 react, react-dom
    Environment = 1,
    // 基础类库，比如 lodash deep fusion antd
    Library = 2,
    // 主题
    Theme = 3,
    // 运行时
    Runtime = 4,
    // 业务组件
    Components = 5,
    // 应用 & 页面
    App = 6,
}
export const AssetLevels = [
    AssetLevel.Environment,
    AssetLevel.Library,
    AssetLevel.Theme,
    AssetLevel.Runtime,
    AssetLevel.Components,
    AssetLevel.App,
];

export enum IPublicEnumTransitionType {
    appear = 'appear',
    enter = 'enter',
    leave = 'leave',
}

export enum IPublicEnumContextMenuType {
    ADD_ELEMENT = 'ADD_ELEMENT',
    CONTEXT_MENU = 'CONTEXT_MENU',
    DELETE_ELEMENT = 'DELETE_ELEMENT',
    UPDATE_ELEMENT = 'UPDATE_ELEMENT',
}