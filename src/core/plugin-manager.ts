import store from 'store';
import { get as lodashGet } from 'lodash';
import { ReactNode, ReactElement, ComponentType, Component } from 'react';
import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
// eslint-disable-next-line import/no-named-as-default
// eslint-disable-next-line max-len
export type ILowCodePluginRuntime = ILowCodePluginRuntimeCore & ILowCodePluginRuntimeExportsAccessor;
interface ILowCodePluginRuntimeExportsAccessor {
    [propName: string]: any;
}
export interface IPublicTypePluginConfig {
    init(): void;
    destroy?(): void;
    exports?(): any;
}
export interface IPublicApiLogger {

    /**
     * debug info
     */
    debug(...args: any | any[]): void;

    /**
     * normal info output
     */
    info(...args: any | any[]): void;

    /**
     * warning info output
     */
    warn(...args: any | any[]): void;

    /**
     * error info output
     */
    error(...args: any | any[]): void;

    /**
     * log info output
     */
    log(...args: any | any[]): void;
}
export declare type IPublicTypePreferenceValueType = string | number | boolean;

export interface IPublicTypePluginDeclarationProperty {
    // shape like 'name' or 'group.name' or 'group.subGroup.name'
    key: string;
    // must have either one of description & markdownDescription
    description: string;
    // value in 'number', 'string', 'boolean'
    type: string;
    // default value
    // NOTE! this is only used in configuration UI, won`t affect runtime
    default?: IPublicTypePreferenceValueType;
    // only works when type === 'string', default value false
    useMultipleLineTextInput?: boolean;
    // enum values, only works when type === 'string'
    enum?: any[];
    // descriptions for enum values
    enumDescriptions?: string[];
    // message that describing deprecation of this property
    deprecationMessage?: string;
}

export interface IPublicTypePluginDeclaration {
    // this will be displayed on configuration UI, can be plugin name
    title: string;
    properties: IPublicTypePluginDeclarationProperty[];
}

export interface IPublicTypePluginMeta {
    /**
     * define dependencies which the plugin depends on
     */
    dependencies?: string[];
    /**
     * specify which engine version is compatible with the plugin
     */
    engines?: {
        /** e.g. '^1.0.0' */
        lowcodeEngine?: string;
    };
    preferenceDeclaration?: IPublicTypePluginDeclaration;

    /**
     * use 'common' as event prefix when eventPrefix is not set.
     * strongly recommend using pluginName as eventPrefix
     *
     * eg.
     *   case 1, when eventPrefix is not specified
     *        event.emit('someEventName') is actually sending event with name 'common:someEventName'
     *
     *   case 2, when eventPrefix is 'myEvent'
     *        event.emit('someEventName') is actually sending event with name 'myEvent:someEventName'
     */
    eventPrefix?: string;
}

export interface ILowCodePluginRuntimeCore {
    name: string;
    dep: string[];
    disabled: boolean;
    config: IPublicTypePluginConfig;
    logger: IPublicApiLogger;
    meta: IPublicTypePluginMeta;
    init(forceInit?: boolean): void;
    isInited(): boolean;
    destroy(): void;
    toProxy(): any;
    setDisabled(flag: boolean): void;
}
// 保留的事件前缀
const RESERVED_EVENT_PREFIX = ['designer', 'editor', 'skeleton', 'renderer', 'render', 'utils', 'plugin', 'engine', 'editor-core', 'engine-core', 'plugins', 'event', 'events', 'log', 'logger', 'ctx', 'context'];

export interface IPluginPreferenceMananger {
    getPreferenceValue: (key: string, defaultValue?: IPublicTypePreferenceValueType) => IPublicTypePreferenceValueType | undefined;
}
/**
 * 所有可能的停靠位置
 */


export interface IPublicTypeWidgetBaseConfig {
    [extra: string]: any;
    type: string;
    name: string;
    /**
     * 停靠位置：
     * - 当 type 为 'Panel' 时自动为 'leftFloatArea'；
     * - 当 type 为 'Widget' 时自动为 'mainArea'；
     * - 其他时候自动为 'leftArea'；
     */
    area?: IPublicTypeWidgetConfigArea;
    props?: Record<string, any>;
    content?: any;
    contentProps?: Record<string, any>;
}


export type IPublicTypeSkeletonConfig = IPublicTypePanelDockConfig | IPublicTypeWidgetBaseConfig;


export type IPublicTypeHotkeyCallback = (e: KeyboardEvent, combo?: string) => any | false;

export interface IPublicTypeHotkeyCallbackConfig {
    callback: IPublicTypeHotkeyCallback;
    modifiers: string[];
    action: string;
    seq?: string;
    level?: number;
    combo?: string;
}
export interface IPublicTypeHotkeyCallbacks {
    [key: string]: IPublicTypeHotkeyCallbackConfig[];
}
export interface IPublicTypeDisposable {
    (): void;
}

export interface IPublicApiHotkey {

    /**
     * 获取当前快捷键配置
     *
     * @experimental
     * @since v1.1.0
     */
    get callbacks(): IPublicTypeHotkeyCallbacks;

    /**
     * 绑定快捷键
     * bind hotkey/hotkeys,
     * @param combos 快捷键，格式如：['command + s'] 、['ctrl + shift + s'] 等
     * @param callback 回调函数
     * @param action
     */
    bind(
        combos: string[] | string,
        callback: IPublicTypeHotkeyCallback,
        action?: string,
    ): IPublicTypeDisposable;
}

export interface IPublicTypeI18nData {
    type: 'i18n';
    intl?: ReactNode;
    [key: string]: any;
}

export interface IPublicTypeIconConfig {
    type: string;
    size?: number | 'small' | 'xxs' | 'xs' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl' | 'inherit';
    className?: string;
}

export declare type TipContent = string | IPublicTypeI18nData | ReactNode | IPublicTypeTipConfig;
export declare type IPublicTypeIconType = string | ReactElement | ComponentType<any> | IPublicTypeIconConfig;

export interface IPublicTypeTitleConfig {
    /**
     * 文字描述
     */
    label?: IPublicTypeI18nData | ReactNode;
    /**
     * hover 后的展现内容
     */
    tip?: TipContent;
    /**
     * 文档链接，暂未实现
     */
    docUrl?: string;
    /**
     * 图标
     */
    icon?: IPublicTypeIconType;
    /**
     * CSS 类
     */
    className?: string;
}

export declare type IPublicTypeCustomView = ReactElement | ComponentType<any>;
export declare type IPublicTypeTitleContent = string | IPublicTypeI18nData | ReactElement | IPublicTypeTitleConfig;


export interface IPublicTypeRegisteredSetter {
    component: IPublicTypeCustomView;
    defaultProps?: object;
    title?: IPublicTypeTitleContent;
    /**
     * for MixedSetter to check this setter if available
     */
    condition?: (field: any) => boolean;
    /**
     * for MixedSetter to manual change to this setter
     */
    initialValue?: any | ((field: any) => any);
    recommend?: boolean;
    isDynamic?: boolean;
}

export interface IPublicApiSetters {
    /**
     * 获取指定 setter
     * get setter by type
     * @param type
     * @returns
     */
    getSetter(type: string): IPublicTypeRegisteredSetter | null;
    /**
     * 获取已注册的所有 settersMap
     * get map of all registered setters
     * @returns
     */
    getSettersMap(): Map<string, IPublicTypeRegisteredSetter & {
        type: string;
    }>;
    /**
     * 注册一个 setter
     * register a setter
     * @param typeOrMaps
     * @param setter
     * @returns
     */
    registerSetter(typeOrMaps: string | {
        [key: string]: IPublicTypeCustomView | IPublicTypeRegisteredSetter;
    }, setter?: IPublicTypeCustomView | IPublicTypeRegisteredSetter | undefined): void;
}
export interface IPublicModelEngineConfig {
    /**
     * 判断指定 key 是否有值
     * check if config has certain key configed
     * @param key
     * @returns
     */
    has(key: string): boolean;
    /**
     * 获取指定 key 的值
     * get value by key
     * @param key
     * @param defaultValue
     * @returns
     */
    get(key: string, defaultValue?: any): any;
    /**
     * 设置指定 key 的值
     * set value for certain key
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * 批量设值，set 的对象版本
     * set multiple config key-values
     * @param config
     */
    setConfig(config: {
        [key: string]: any;
    }): void;
    /**
     * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
     *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
     * wait until value of certain key is set, will only be
     * triggered once.
     * @param key
     * @returns
     */
    onceGot(key: string): Promise<any>;
    /**
     * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
     * set callback for event of value set for some key
     * this will be called each time the value is set
     * @param key
     * @param fn
     * @returns
     */
    onGot(key: string, fn: (data: any) => void): () => void;
    /**
     * 获取全局 Preference, 用于管理全局浏览器侧用户 Preference，如 Panel 是否钉住
     * get global user preference manager, which can be use to store
     * user`s preference in user localstorage, such as a panel is pinned or not.
     * @returns {IPublicModelPreference}
     * @since v1.1.0
     */
    getPreference(): IPublicModelPreference;
}
export interface IPublicModelPreference {
    /**
     * set value from local storage by module and key
     */
    set(key: string, value: any, module?: string): void;
    /**
     * get value from local storage by module and key
     */
    get(key: string, module: string): any;
    /**
     * check if local storage contain certain key
     */
    contains(key: string, module: string): boolean;
}
/**
 * 用于描述组件面板中的 tab 和 category
 */
export interface IPublicTypeComponentSort {
    /**
     * 用于描述组件面板的 tab 项及其排序，例如：["精选组件", "原子组件"]
     */
    groupList?: string[];
    /**
     * 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列；
     */
    categoryList?: string[];
}
declare type FilterOptional<T> = Pick<T, Exclude<{
    [K in keyof T]: T extends Record<K, T[K]> ? K : never;
}[keyof T], undefined>>;
declare type FilterNotOptional<T> = Pick<T, Exclude<{
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
}[keyof T], undefined>>;
declare type PartialEither<T, K extends keyof any> = {
    [P in Exclude<keyof FilterOptional<T>, K>]-?: T[P];
} & {
        [P in Exclude<keyof FilterNotOptional<T>, K>]?: T[P];
    } & {
        [P in Extract<keyof T, K>]?: undefined;
    };
declare type Object = {
    [name: string]: any;
};
export declare type EitherOr<O extends Object, L extends string, R extends string> = (PartialEither<Pick<O, L | R>, L> | PartialEither<Pick<O, L | R>, R>) & Omit<O, L | R>;


/**
 * 定义组件大包及 external 资源的信息
 * 应该被编辑器默认加载
 */
export declare type IPublicTypePackage = EitherOr<{
    /**
     * npm 包名
     */
    package: string;
    /**
     * 包唯一标识
     */
    id: string;
    /**
     * 包版本号
     */
    version: string;
    /**
     * 组件渲染态视图打包后的 CDN url 列表，包含 js 和 css
     */
    urls?: string[] | any;
    /**
     * 组件编辑态视图打包后的 CDN url 列表，包含 js 和 css
     */
    editUrls?: string[] | any;
    /**
     * 作为全局变量引用时的名称，和webpack output.library字段含义一样，用来定义全局变量名
     */
    library: string;
    /**
     * @experimental
     *
     * TODO: 需推进提案 @度城
     */
    async?: boolean;
    /**
     * 标识当前 package 从其他 package 的导出方式
     */
    exportMode?: 'functionCall';
    /**
     * 标识当前 package 是从 window 上的哪个属性导出来的
     */
    exportSourceLibrary?: any;
    /**
     * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
     */
    exportName?: string;
    /**
     * 低代码组件 schema 内容
     */
    schema?: IPublicTypeComponentSchema;
}, 'package', 'id'>;

/**
 * 数据源对象
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface InterpretDataSourceConfig {
    id: string;
    isInit?: boolean | JSExpression;
    isSync?: boolean | JSExpression;
    type?: string;
    requestHandler?: JSFunction;
    dataHandler?: JSFunction;
    errorHandler?: JSFunction;
    willFetch?: JSFunction;
    shouldFetch?: JSFunction;
    options?: {
        uri: string | JSExpression;
        api?: string | JSExpression; // 兼容
        params?: JSONObject | JSExpression;
        method?: string | JSExpression;
        isCors?: boolean | JSExpression;
        timeout?: number | JSExpression;
        headers?: JSONObject | JSExpression;
        [option: string]: CompositeValue;
    };
    [otherKey: string]: CompositeValue;
}
export type JSONArray = JSONValue[];
// JSON 基本类型
export type JSONValue =
    | boolean
    | string
    | number
    | null
    | undefined
    | JSONArray
    | JSONObject;
// 复合类型
export type CompositeValue =
    | JSONValue
    | JSExpression
    | JSFunction
    // | JSSlot // 后续这里应该要再提取一个 base types
    | CompositeArray
    | CompositeObject;
export type CompositeArray = CompositeValue[];
export interface CompositeObject {
    [key: string]: CompositeValue;
}
export interface JSONObject {
    [key: string]: JSONValue;
}
// 函数
export interface JSFunction {
    type: 'JSFunction';
    /**
     * 表达式字符串
     */
    value: string;
}

// 表达式
export interface JSExpression {
    type: 'JSExpression';
    /**
     * 表达式字符串
     */
    value: string;
    /**
     * 模拟值
     */
    mock?: any;
    /** 源码 */
    compiled?: string;
}
/**
 * 数据源对象
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface InterpretDataSource {
    list: InterpretDataSourceConfig[];
    dataHandler?: JSFunction;
}
export declare type IPublicTypeJSONArray = IPublicTypeJSONValue[];
export interface IPublicTypeJSONObject {
    [key: string]: IPublicTypeJSONValue;
}
export declare type IPublicTypeJSONValue = boolean | string | number | null | undefined | IPublicTypeJSONArray | IPublicTypeJSONObject;
/**
 * 变量表达式
 *
 * 表达式内通过 this 对象获取上下文
 */
export interface IPublicTypeJSExpression {
    type: 'JSExpression';
    /**
     * 表达式字符串
     */
    value: string;
    /**
     * 模拟值
     *
     * @todo 待标准描述
     */
    mock?: any;
    /**
     * 源码
     *
     * @todo 待标准描述
     */
    compiled?: string;
}
/**
 * 事件函数类型
 * @see https://lowcode-engine.cn/lowcode
 *
 * 保留与原组件属性、生命周期 ( React / 小程序) 一致的输入参数，并给所有事件函数 binding 统一一致的上下文（当前组件所在容器结构的 this 对象）
 */
export interface IPublicTypeJSFunction {
    type: 'JSFunction';
    /**
     * 函数定义，或直接函数表达式
     */
    value: string;
    /**
     * 源码
     *
     * @todo 待标准描述
     */
    compiled?: string;
    /**
     * 模拟值
     *
     * @todo 待标准描述
     */
    mock?: any;
    /**
     * 额外扩展属性，如 extType、events
     *
     * @todo 待标准描述
     */
    [key: string]: any;
}
export interface IPublicTypeCompositeObject {
    [key: string]: IPublicTypeCompositeValue;
}
export declare type IPublicTypePropsMap = IPublicTypeCompositeObject;
export interface IPublicTypeNodeSchema {
    id?: string;
    /**
     * 组件名称 必填、首字母大写
     */
    componentName: string;
    /**
     * 组件属性对象
     */
    props?: {
        children?: IPublicTypeNodeData | IPublicTypeNodeData[];
    } & IPublicTypePropsMap;
    /**
     * 组件属性对象
     */
    leadingComponents?: string;
    /**
     * 渲染条件
     */
    condition?: IPublicTypeCompositeValue;
    /**
     * 循环数据
     */
    loop?: IPublicTypeCompositeValue;
    /**
     * 循环迭代对象、索引名称 ["item", "index"]
     */
    loopArgs?: [string, string];
    /**
     * 子节点
     */
    children?: IPublicTypeNodeData | IPublicTypeNodeData[];
    /**
     * 是否锁定
     */
    isLocked?: boolean;
    conditionGroup?: string;
    title?: string;
    ignore?: boolean;
    locked?: boolean;
    hidden?: boolean;
    isTopFixed?: boolean;
    /** @experimental 编辑态内部使用 */
    __ctx?: any;
}
export declare type IPublicTypeDOMText = string;

export declare type IPublicTypeNodeData = IPublicTypeNodeSchema | IPublicTypeJSExpression | IPublicTypeDOMText;

/**
 * Slot 函数类型
 *
 * 通常用于描述组件的某一个属性为 ReactNode 或 Function return ReactNode 的场景。
 */
export interface IPublicTypeJSSlot {
    /**
     * type
     */
    type: 'JSSlot';
    /**
     * @todo 待标准描述
     */
    title?: string;
    /**
     * @todo 待标准描述
     */
    id?: string;
    /**
     * 组件的某一个属性为 Function return ReactNode 时，函数的入参
     *
     * 其子节点可以通过 this[参数名] 来获取对应的参数。
     */
    params?: string[];
    /**
     * 具体的值。
     */
    value?: IPublicTypeNodeData[] | IPublicTypeNodeData;
    /**
     * @todo 待标准描述
     */
    name?: string;
}
export type IPublicTypeCompositeArray = IPublicTypeCompositeValue[];
export declare type IPublicTypeCompositeValue = IPublicTypeJSONValue | IPublicTypeJSExpression | IPublicTypeJSFunction | IPublicTypeJSSlot | IPublicTypeCompositeArray | IPublicTypeCompositeObject;

export interface IPublicTypeContainerSchema extends IPublicTypeNodeSchema {
    /**
     * 'Block' | 'Page' | 'Component';
     */
    componentName: string;
    /**
     * 文件名称
     */
    fileName: string;
    /**
     * @todo 待文档定义
     */
    meta?: Record<string, unknown>;
    /**
     * 容器初始数据
     */
    state?: {
        [key: string]: IPublicTypeCompositeValue;
    };
    /**
     * 自定义方法设置
     */
    methods?: {
        [key: string]: IPublicTypeJSExpression | IPublicTypeJSFunction;
    };
    /**
     * 生命周期对象
     */
    lifeCycles?: {
        [key: string]: IPublicTypeJSExpression | IPublicTypeJSFunction;
    };
    /**
     * 样式文件
     */
    css?: string;
    /**
     * 异步数据源配置
     */
    dataSource?: DataSource;
    /**
     * 低代码业务组件默认属性
     */
    defaultProps?: IPublicTypeCompositeObject;
}
/**
 * 数据源对象
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface DataSource {
    list: InterpretDataSourceConfig[];
    dataHandler?: JSFunction;
}
/**
 * 低代码业务组件容器
 * @see https://lowcode-engine.cn/lowcode
 */
export interface IPublicTypeComponentSchema extends IPublicTypeContainerSchema {
    componentName: 'Component';
}

export interface IPublicTypeEditorGetOptions {
    forceNew?: boolean;
    sourceCls?: new (...args: any[]) => any;
}

export type IPublicTypeEditorGetResult<T, ClsType> = T extends undefined ? ClsType extends {
    prototype: infer R;
} ? R : any : T;

export type IPublicTypeEditorValueKey = (new (...args: any[]) => any) | symbol | string;
export const Change = 'node.prop.change';
export const InnerChange = 'node.innerProp.change';
export const Rerender = 'node.edit.rerender.time';
export interface ChangeOptions {
    key?: string | number;
    prop?: any;
    node: Node;
    newValue: any;
    oldValue: any;
}
export interface RerenderOptions {
    time: number;
    componentName?: string;
    type?: string;
    nodeCount?: number;
}
export interface EventConfig {
    [Change]: (options: ChangeOptions) => any;
    [InnerChange]: (options: ChangeOptions) => any;
    [Rerender]: (options: RerenderOptions) => void;
    [eventName: string]: any;
}
/**
 * duck-typed power-di
 *
 * @see https://www.npmjs.com/package/power-di
 */
export interface IPublicTypeEditorRegisterOptions {
    /**
     * default: true
     */
    singleton?: boolean;
    /**
     * if data a class, auto new a instance.
     * if data a function, auto run(lazy).
     *  default: true
     */
    autoNew?: boolean;
}

export interface IPublicModelEditor extends StrictEventEmitter<EventEmitter, EventConfig> {
    get: <T = undefined, KeyOrType = any>(
        keyOrType: KeyOrType,
        opt?: IPublicTypeEditorGetOptions
    ) => IPublicTypeEditorGetResult<T, KeyOrType> | undefined;

    has: (keyOrType: IPublicTypeEditorValueKey) => boolean;

    set: (key: IPublicTypeEditorValueKey, data: any) => void | Promise<void>;

    onceGot: <T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(keyOrType: KeyOrType) => Promise<IPublicTypeEditorGetResult<T, KeyOrType>>;

    onGot: <T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
        keyOrType: KeyOrType,
        fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void
    ) => () => void;

    register: (data: any, key?: IPublicTypeEditorValueKey, options?: IPublicTypeEditorRegisterOptions) => void;

    get eventBus(): IPublicApiEvent;

    setAssets(assets: IPublicTypeAssetsJson): void;
}
export interface IPublicModelSettingTarget {

    /**
     * 同样类型的节点
     */
    readonly isSameComponent: boolean;

    /**
     * 一个
     */
    readonly isSingle: boolean;

    /**
     * 多个
     */
    readonly isMultiple: boolean;

    /**
     * 编辑器引用
     */
    readonly editor: IPublicModelEditor;

    readonly setters: IPublicApiSetters;

    /**
     * 访问路径
     */
    readonly path: Array<string | number>;

    /**
     * 顶端
     */
    readonly top: IPublicModelSettingTarget;

    /**
     * 父级
     */
    readonly parent: IPublicModelSettingTarget;

    /**
     * 获取当前值
     */
    getValue: () => any;

    /**
     * 设置当前值
     */
    setValue: (value: any) => void;

    /**
     * 取得子项
     */
    get: (propName: string | number) => IPublicModelSettingTarget | null;

    /**
     * 取得子项
     */
    getProps?: () => IPublicModelSettingTarget;

    /**
     * 获取子项属性值
     */
    getPropValue: (propName: string | number) => any;

    /**
     * 设置子项属性值
     */
    setPropValue: (propName: string | number, value: any) => void;

    /**
     * 清除已设置值
     */
    clearPropValue: (propName: string | number) => void;

    /**
     * 获取顶层附属属性值
     */
    getExtraPropValue: (propName: string) => any;

    /**
     * 设置顶层附属属性值
     */
    setExtraPropValue: (propName: string, value: any) => void;

    // @todo 补充 node 定义
    /**
     * 获取 node 中的第一项
     */
    getNode: () => any;
}
/**
 * 资源引用信息，Npm 的升级版本，
 */
export type IPublicTypeReference = EitherOr<{
    /**
     * 引用资源的 id 标识
     */
    id: string;
    /**
     * 引用资源的包名
     */
    package: string;
    /**
     * 引用资源的导出对象中的属性值名称
     */
    exportName: string;
    /**
     * 引用 exportName 上的子对象
     */
    subName: string;
    /**
     * 引用的资源主入口
     */
    main?: string;
    /**
     * 是否从引用资源的导出对象中获取属性值
     */
    destructuring?: boolean;
    /**
     * 资源版本号
     */
    version: string;
}, 'package', 'id'>;

/**
 * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
 */
export interface IPublicTypeCallbacks {
    // hooks
    onMouseDownHook?: (e: MouseEvent, currentNode: any) => any;
    onDblClickHook?: (e: MouseEvent, currentNode: any) => any;
    onClickHook?: (e: MouseEvent, currentNode: any) => any;
    // onLocateHook?: (e: any, currentNode: any) => any;
    // onAcceptHook?: (currentNode: any, locationData: any) => any;
    onMoveHook?: (currentNode: any) => boolean;
    // thinkof 限制性拖拽
    onHoverHook?: (currentNode: any) => boolean;
    onChildMoveHook?: (childNode: any, currentNode: any) => boolean;

    // events
    onNodeRemove?: (removedNode: any, currentNode: any) => void;
    onNodeAdd?: (addedNode: any, currentNode: any) => void;
    onSubtreeModified?: (currentNode: any, options: any) => void;
    onResize?: (
        e: MouseEvent & {
            trigger: string;
            deltaX?: number;
            deltaY?: number;
        },
        currentNode: any,
    ) => void;
    onResizeStart?: (
        e: MouseEvent & {
            trigger: string;
            deltaX?: number;
            deltaY?: number;
        },
        currentNode: any,
    ) => void;
    onResizeEnd?: (
        e: MouseEvent & {
            trigger: string;
            deltaX?: number;
            deltaY?: number;
        },
        currentNode: any,
    ) => void;
}

export interface IPublicTypeInitialItem {
    name: string;
    initial: (target: IPublicModelSettingTarget, currentValue: any) => any;
}
/**
* 可用片段
*
* 内容为组件不同状态下的低代码 schema (可以有多个)，用户从组件面板拖入组件到设计器时会向页面 schema 中插入 snippets 中定义的组件低代码 schema
*/
export interface IPublicTypeSnippet {
    /**
     * 组件分类 title
     */
    title?: string;
    /**
     * snippet 截图
     */
    screenshot?: string;
    /**
     * snippet 打标
     *
     * @deprecated 暂未使用
     */
    label?: string;
    /**
     * 待插入的 schema
     */
    schema?: IPublicTypeNodeSchema;
}
// thinkof Array
/**
 * Live Text Editing（如果 children 内容是纯文本，支持双击直接编辑）的可配置项目
 */
export interface IPublicTypeLiveTextEditingConfig {

    /**
     * @todo 待补充文档
     */
    propTarget: string;

    /**
     * @todo 待补充文档
     */
    selector?: string;

    /**
     * 编辑模式 纯文本 | 段落编辑 | 文章编辑（默认纯文本，无跟随工具条）
     * @default 'plaintext'
     */
    mode?: 'plaintext' | 'paragraph' | 'article';

    /**
     * 从 contentEditable 获取内容并设置到属性
     */
    onSaveContent?: (content: string, prop: any) => any;
}
/**
 * 动作描述
 */
export interface IPublicTypeActionContentObject {
    /**
     * 图标
     */
    icon?: IPublicTypeIconType;
    /**
     * 描述
     */
    title?: TipContent;
    /**
     * 执行动作
     */
    action?: (currentNode: any) => void;
}
/**
 * @todo 工具条动作
 */

export interface IPublicTypeComponentAction {

    /**
     * behaviorName
     */
    name: string;

    /**
     * 菜单名称
     */
    content: string | ReactNode | IPublicTypeActionContentObject;

    /**
     * 子集
     */
    items?: IPublicTypeComponentAction[];

    /**
     * 显示与否
     * always: 无法禁用
     */
    condition?: boolean | ((currentNode: any) => boolean) | 'always';

    /**
     * 显示在工具条上
     */
    important?: boolean;
}

export interface IPublicModelComponentMeta {

    /**
     * 组件名
     * component name
     */
    get componentName(): string;

    /**
     * 是否是「容器型」组件
     * is container node or not
     */
    get isContainer(): boolean;

    /**
     * 是否是最小渲染单元。
     * 当组件需要重新渲染时：
     *  若为最小渲染单元，则只渲染当前组件，
     *  若不为最小渲染单元，则寻找到上层最近的最小渲染单元进行重新渲染，直至根节点。
     *
     * check if this is a mininal render unit.
     * when a rerender is needed for a component:
     *  case 'it`s a mininal render unit':  only render itself.
     *  case 'it`s not a mininal render unit': find a mininal render unit to render in
     *  its ancesters until root node is reached.
     */
    get isMinimalRenderUnit(): boolean;

    /**
     * 是否为「模态框」组件
     * check if this is a modal component or not.
     */
    get isModal(): boolean;

    /**
     * 获取用于设置面板显示用的配置
     * get configs for Settings Panel
     */
    get configure(): IPublicTypeFieldConfig[];

    /**
     * 标题
     * title for this component
     */
    get title(): string | IPublicTypeI18nData | ReactElement;

    /**
     * 图标
     * icon config for this component
     */
    get icon(): IPublicTypeIconType;

    /**
     * 组件 npm 信息
     * npm informations
     */
    get npm(): IPublicTypeNpmInfo;

    /**
     * 当前组件的可用 Action
     * available actions
     */
    get availableActions(): IPublicTypeComponentAction[];

    /**
     * 组件元数据中高级配置部分
     * configure.advanced
     * @since v1.1.0
     */
    get advanced(): IPublicTypeAdvanced;

    /**
     * 设置 npm 信息
     * set method for npm inforamtion
     * @param npm
     */
    setNpm(npm: IPublicTypeNpmInfo): void;

    /**
     * 获取元数据
     * get component metadata
     */
    getMetadata(): IPublicTypeTransformedComponentMetadata;

    /**
     * 检测当前对应节点是否可被放置在父节点中
     * check if the current node could be placed in parent node
     * @param my 当前节点
     * @param parent 父节点
     */
    checkNestingUp(my: IPublicModelNode | IPublicTypeNodeData, parent: any): boolean;

    /**
     * 检测目标节点是否可被放置在父节点中
     * check if the target node(s) could be placed in current node
     * @param my 当前节点
     * @param parent 父节点
     */
    checkNestingDown(
        my: IPublicModelNode | IPublicTypeNodeData,
        target: IPublicTypeNodeSchema | IPublicModelNode | IPublicTypeNodeSchema[],
    ): boolean;

    /**
     * 刷新元数据，会触发元数据的重新解析和刷新
     * refresh metadata
     */
    refreshMetadata(): void;
}
export interface IPublicModelSelection {

    /**
     * 返回选中的节点 id
     * get ids of selected nodes
     */
    get selected(): string[];

    /**
     * 返回选中的节点（如多个节点只返回第一个）
     * return selected Node instance，return the first one if multiple nodes are selected
     * @since v1.1.0
     */
    get node(): IPublicModelNode | null;

    /**
     * 选中指定节点（覆盖方式）
     * select node with id, this will override current selection
     * @param id
     */
    select(id: string): void;

    /**
     * 批量选中指定节点们
     * select node with ids, this will override current selection
     *
     * @param ids
     */
    selectAll(ids: string[]): void;

    /**
     * 移除选中的指定节点
     * remove node from selection with node id
     * @param id
     */
    remove(id: string): void;

    /**
     * 清除所有选中节点
     * clear current selection
     */
    clear(): void;

    /**
     * 判断是否选中了指定节点
     * check if node with specific id is selected
     * @param id
     */
    has(id: string): boolean;

    /**
     * 选中指定节点（增量方式）
     * add node with specific id to selection
     * @param id
     */
    add(id: string): void;

    /**
     * 获取选中的节点实例
     * get selected nodes
     */
    getNodes(): IPublicModelNode[];

    /**
     * 获取选区的顶层节点
     * get seleted top nodes
     * for example:
     *  getNodes() returns [A, subA, B], then
     *  getTopNodes() will return [A, B], subA will be removed
     * @since v1.0.16
     */
    getTopNodes(includeRoot?: boolean): IPublicModelNode[];

    /**
     * 注册 selection 变化事件回调
     * set callback which will be called when selection is changed
     * @since v1.1.0
     */
    onSelectionChange(fn: (ids: string[]) => void): IPublicTypeDisposable;
}
export interface IPublicModelDetecting {

    /**
     * 是否启用
     * check if current detecting is enabled
     * @since v1.1.0
     */
    get enable(): boolean;

    /**
     * 当前 hover 的节点
     * get current hovering node
     * @since v1.0.16
     */
    get current(): IPublicModelNode | null;

    /**
     * hover 指定节点
     * capture node with nodeId
     * @param id 节点 id
     */
    capture(id: string): void;

    /**
     * hover 离开指定节点
     * release node with nodeId
     * @param id 节点 id
     */
    release(id: string): void;

    /**
     * 清空 hover 态
     * clear all hover state
     */
    leave(): void;

    /**
     * hover 节点变化事件
     * set callback which will be called when hovering object changed.
     * @since v1.1.0
     */
    onDetectingChange(fn: (node: IPublicModelNode | null) => void): IPublicTypeDisposable;
}
export interface IPublicModelHistory {

    /**
     * 历史记录跳转到指定位置
     * go to a specific history
     * @param cursor
     */
    go(cursor: number): void;

    /**
     * 历史记录后退
     * go backward in history
     */
    back(): void;

    /**
     * 历史记录前进
     * go forward in history
     */
    forward(): void;

    /**
     * 保存当前状态
     * do save current change as a record in history
     */
    savePoint(): void;

    /**
     * 当前是否是「保存点」，即是否有状态变更但未保存
     * check if there is unsaved change for history
     */
    isSavePoint(): boolean;

    /**
     * 获取 state，判断当前是否为「可回退」、「可前进」的状态
     * get flags in number which indicat current change state
     *
     *  |    1     |     1    |    1     |
     *  | -------- | -------- | -------- |
     *  | modified | redoable | undoable |
     * eg.
     *  7 means : modified && redoable && undoable
     *  5 means : modified && undoable
     */
    getState(): number;

    /**
     * 监听 state 变更事件
     * monitor on stateChange event
     * @param func
     */
    onChangeState(func: () => any): IPublicTypeDisposable;

    /**
     * 监听历史记录游标位置变更事件
     * monitor on cursorChange event
     * @param func
     */
    onChangeCursor(func: () => any): IPublicTypeDisposable;
}
export interface IPublicApiSimulatorHost {
    /**
     * 获取 contentWindow
     * @experimental unstable api, pay extra caution when trying to use it
     */
    get contentWindow(): Window | undefined;

    /**
     * 获取 contentDocument
     * @experimental unstable api, pay extra caution when trying to use it
     */
    get contentDocument(): Document | undefined;

    /**
     * @experimental unstable api, pay extra caution when trying to use it
     */
    get renderer(): any;

    /**
     * 设置若干用于画布渲染的变量，比如画布大小、locale 等。
     * set config for simulator host, eg. device locale and so on.
     * @param key
     * @param value
     */
    set(key: string, value: any): void;

    /**
     * 获取模拟器中设置的变量，比如画布大小、locale 等。
     * set config value by key
     * @param key
     * @returns
     */
    get(key: string): any;

    /**
     * 滚动到指定节点
     * scroll to specific node
     * @param node
     * @since v1.1.0
     */
    scrollToNode(node: IPublicModelNode): void;

    /**
     * 刷新渲染画布
     * make simulator render again
     */
    rerender(): void;
}
/**
 * 页面容器
 * @see https://lowcode-engine.cn/lowcode
 */
export interface IPublicTypePageSchema extends IPublicTypeContainerSchema {
    componentName: 'Page';
}
/**
* 区块容器
* @see https://lowcode-engine.cn/lowcode
*/

export interface IPublicTypeBlockSchema extends IPublicTypeContainerSchema {
    componentName: 'Block';
}

export type IPublicTypeRootSchema = IPublicTypePageSchema | IPublicTypeComponentSchema | IPublicTypeBlockSchema;
export enum IPublicEnumTransformStage {
    Render = 'render',
    Serilize = 'serilize',
    Save = 'save',
    Clone = 'clone',
    Init = 'init',
    Upgrade = 'upgrade',
}
/**
 * @deprecated use IPublicEnumTransformStage instead
 */
export enum TransformStage {
    Render = 'render',
    Serilize = 'serilize',
    Save = 'save',
    Clone = 'clone',
    Init = 'init',
    Upgrade = 'upgrade',
}

export interface IPublicTypeI18nMap {
    [lang: string]: { [key: string]: string };
}
export type IPublicTypeProCodeComponent = IPublicTypeNpmInfo;
export interface IPublicTypeLowCodeComponent {
    /**
     * 研发模式
     */
    devMode: 'lowCode';
    /**
     * 组件名称
     */
    componentName: string;
}
export type IPublicTypeComponentMap = IPublicTypeProCodeComponent | IPublicTypeLowCodeComponent;

export type IPublicTypeComponentsMap = IPublicTypeComponentMap[];
export interface IPublicTypeExternalUtils {
    name: string;
    type: 'npm' | 'tnpm';
    content: IPublicTypeNpmInfo;
}
export interface IPublicTypeInternalUtils {
    name: string;
    type: 'function';
    content: IPublicTypeJSFunction | IPublicTypeJSExpression;
}

export type IPublicTypeUtilItem = IPublicTypeInternalUtils | IPublicTypeExternalUtils;
export type IPublicTypeUtilsMap = IPublicTypeUtilItem[];
/**
* 应用描述
*/

export interface IPublicTypeProjectSchema {
    id?: string;
    /**
     * 当前应用协议版本号
     */
    version: string;
    /**
     * 当前应用所有组件映射关系
     */
    componentsMap: IPublicTypeComponentsMap;
    /**
     * 描述应用所有页面、低代码组件的组件树
     * 低代码业务组件树描述
     * 是长度固定为 1 的数组，即数组内仅包含根容器的描述（低代码业务组件容器类型）
     */
    componentsTree: IPublicTypeRootSchema[];
    /**
     * 国际化语料
     */
    i18n?: IPublicTypeI18nMap;
    /**
     * 应用范围内的全局自定义函数或第三方工具类扩展
     */
    utils?: IPublicTypeUtilsMap;
    /**
     * 应用范围内的全局常量
     */
    constants?: IPublicTypeJSONObject;
    /**
     * 应用范围内的全局样式
     */
    css?: string;
    /**
     * 当前应用的公共数据源
     */
    dataSource?: DataSource;
    /**
     * 当前应用配置信息
     */
    config?: IPublicTypeAppConfig | Record<string, any>;
    /**
     * 当前应用元数据信息
     */
    meta?: Record<string, any>;
}

interface IPublicTypeLayout {
    componentName?: string;
    props?: Record<string, any>;
}
interface IPublicTypeTheme {
    package: string;
    version: string;
    primary: string;
}
export interface IPublicTypeAppConfig {
    sdkVersion?: string;
    historyMode?: string;
    targetRootID?: string;
    layout?: IPublicTypeLayout;
    theme?: IPublicTypeTheme;
    [key: string]: any;
}

export type IPublicTypePropsTransducer = (
    props: IPublicTypeCompositeObject,
    node: IPublicModelNode,
    ctx?: {
        stage: IPublicEnumTransformStage;
    },
) => IPublicTypeCompositeObject;

export interface IPublicApiProject {

    /**
     * 获取当前的 document
     * get current document
     */
    get currentDocument(): IPublicModelDocumentModel | null;

    /**
     * 获取当前 project 下所有 documents
     * get all documents of this project
     * @returns
     */
    get documents(): IPublicModelDocumentModel[];

    /**
     * 获取模拟器的 host
     * get simulator host
     */
    get simulatorHost(): IPublicApiSimulatorHost | null;

    /**
     * 打开一个 document
     * open a document
     * @param doc
     * @returns
     */
    openDocument(doc?: string | IPublicTypeRootSchema | undefined): IPublicModelDocumentModel | null;

    /**
     * 创建一个 document
     * create a document
     * @param data
     * @returns
     */
    createDocument(data?: IPublicTypeRootSchema): IPublicModelDocumentModel | null;

    /**
     * 删除一个 document
     * remove a document
     * @param doc
     */
    removeDocument(doc: IPublicModelDocumentModel): void;

    /**
     * 根据 fileName 获取 document
     * get a document by filename
     * @param fileName
     * @returns
     */
    getDocumentByFileName(fileName: string): IPublicModelDocumentModel | null;

    /**
     * 根据 id 获取 document
     * get a document by id
     * @param id
     * @returns
     */
    getDocumentById(id: string): IPublicModelDocumentModel | null;

    /**
     * 导出 project
     * export project to schema
     * @returns
     */
    exportSchema(stage: IPublicEnumTransformStage): IPublicTypeProjectSchema;

    /**
     * 导入 project schema
     * import schema to project
     * @param schema 待导入的 project 数据
     */
    importSchema(schema?: IPublicTypeProjectSchema): void;

    /**
     * 获取当前的 document
     * get current document
     * @returns
     */
    getCurrentDocument(): IPublicModelDocumentModel | null;

    /**
     * 增加一个属性的管道处理函数
     * add a transducer to process prop
     * @param transducer
     * @param stage
     */
    addPropsTransducer(
        transducer: IPublicTypePropsTransducer,
        stage: IPublicEnumTransformStage,
    ): void;

    /**
     * 绑定删除文档事件
     * set callback for event onDocumentRemoved
     * @param fn
     * @since v1.0.16
     */
    onRemoveDocument(fn: (data: { id: string }) => void): IPublicTypeDisposable;

    /**
     * 当前 project 内的 document 变更事件
     * set callback for event onDocumentChanged
     */
    onChangeDocument(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable;

    /**
     * 当前 project 的模拟器 ready 事件
     * set callback for event onSimulatorHostReady
     */
    onSimulatorHostReady(fn: (host: IPublicApiSimulatorHost) => void): IPublicTypeDisposable;

    /**
     * 当前 project 的渲染器 ready 事件
     * set callback for event onSimulatorRendererReady
     */
    onSimulatorRendererReady(fn: () => void): IPublicTypeDisposable;

    /**
     * 设置多语言语料
     * 数据格式参考 https://github.com/alibaba/lowcode-engine/blob/main/specs/lowcode-spec.md#2434%E5%9B%BD%E9%99%85%E5%8C%96%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%B1%BB%E5%9E%8Baa
     *
     * set I18n data for this project
     * @param value object
     * @since v1.0.17
     */
    setI18n(value: object): void;
}
export interface IPublicModelModalNodesManager {

    /**
     * 设置模态节点，触发内部事件
     * set modal nodes, trigger internal events
     */
    setNodes(): void;

    /**
     * 获取模态节点（们）
     * get modal nodes
     */
    getModalNodes(): IPublicModelNode[];

    /**
     * 获取当前可见的模态节点
     * get current visible modal node
     */
    getVisibleModalNode(): IPublicModelNode | null;

    /**
     * 隐藏模态节点（们）
     * hide modal nodes
     */
    hideModalNodes(): void;

    /**
     * 设置指定节点为可见态
     * set specfic model node as visible
     * @param node Node
     */
    setVisible(node: IPublicModelNode): void;

    /**
     * 设置指定节点为不可见态
     * set specfic model node as invisible
     * @param node Node
     */
    setInvisible(node: IPublicModelNode): void;
}
// eslint-disable-next-line no-shadow
export enum IPublicEnumDragObjectType {
    // eslint-disable-next-line no-shadow
    Node = 'node',
    NodeData = 'nodedata',
}

export interface IPublicTypeDragNodeObject {
    type: IPublicEnumDragObjectType.Node;
    nodes: IPublicModelNode[];
}
export interface IPublicTypeDragNodeDataObject {
    type: IPublicEnumDragObjectType.NodeData;
    data: IPublicTypeNodeSchema | IPublicTypeNodeSchema[];
    thumbnail?: string;
    description?: string;
    [extra: string]: any;
}
export interface IPublicTypeOnChangeOptions {
    type: string;
    node: IPublicModelNode;
}
export interface IPublicTypePropChangeOptions {
    key?: string | number;
    prop?: IPublicModelProp;
    node: IPublicModelNode;
    newValue: any;
    oldValue: any;
}

export interface IPublicModelDocumentModel {

    /**
       * 节点选中区模型实例
       * instance of selection
       */
    selection: IPublicModelSelection;

    /**
     * 画布节点 hover 区模型实例
     * instance of detecting
     */
    detecting: IPublicModelDetecting;

    /**
     * 操作历史模型实例
     * instance of history
     */
    history: IPublicModelHistory;

    /**
     * id
     */
    get id(): string;

    set id(id);

    /**
     * 获取当前文档所属的 project
     * get project which this documentModel belongs to
     * @returns
     */
    get project(): IPublicApiProject;

    /**
     * 获取文档的根节点
     * root node of this documentModel
     * @returns
     */
    get root(): IPublicModelNode | null;

    get focusNode(): IPublicModelNode | null;

    set focusNode(node: IPublicModelNode | null);

    /**
     * 获取文档下所有节点
     * @returns
     */
    get nodesMap(): Map<string, IPublicModelNode>;

    /**
     * 模态节点管理
     * get instance of modalNodesManager
     */
    get modalNodesManager(): IPublicModelModalNodesManager | null;

    /**
     * 根据 nodeId 返回 Node 实例
     * get node by nodeId
     * @param nodeId
     * @returns
     */
    getNodeById(nodeId: string): IPublicModelNode | null;

    /**
     * 导入 schema
     * import schema data
     * @param schema
     */
    importSchema(schema: IPublicTypeRootSchema): void;

    /**
     * 导出 schema
     * export schema
     * @param stage
     * @returns
     */
    exportSchema(stage: IPublicEnumTransformStage): any;

    /**
     * 插入节点
     * insert a node
     */
    insertNode(
        parent: IPublicModelNode,
        thing: IPublicModelNode,
        at?: number | null | undefined,
        copy?: boolean | undefined
    ): IPublicModelNode | null;

    /**
     * 创建一个节点
     * create a node
     * @param data
     * @returns
     */
    createNode(data: any): IPublicModelNode | null;

    /**
     * 移除指定节点/节点id
     * remove a node by node instance or nodeId
     * @param idOrNode
     */
    removeNode(idOrNode: string | IPublicModelNode): void;

    /**
     * componentsMap of documentModel
     * @param extraComps
     * @returns
     */
    getComponentsMap(extraComps?: string[]): any;

    /**
     * 检查拖拽放置的目标节点是否可以放置该拖拽对象
     * check if dragOjbect can be put in this dragTarget
     * @param dropTarget 拖拽放置的目标节点
     * @param dragObject 拖拽的对象
     * @returns boolean 是否可以放置
     * @since v1.0.16
     */
    checkNesting(
        dropTarget: IPublicModelNode,
        dragObject: IPublicTypeDragNodeObject | IPublicTypeDragNodeDataObject
    ): boolean;

    /**
     * 当前 document 新增节点事件
     * set callback for event on node is created for a document
     */
    onAddNode(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;

    /**
     * 当前 document 新增节点事件，此时节点已经挂载到 document 上
     * set callback for event on node is mounted to canvas
     */
    onMountNode(fn: (payload: { node: IPublicModelNode }) => void): IPublicTypeDisposable;

    /**
     * 当前 document 删除节点事件
     * set callback for event on node is removed
     */
    onRemoveNode(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;

    /**
     * 当前 document 的 hover 变更事件
     *
     * set callback for event on detecting changed
     */
    onChangeDetecting(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;

    /**
     * 当前 document 的选中变更事件
     * set callback for event on selection changed
     */
    onChangeSelection(fn: (ids: string[]) => void): IPublicTypeDisposable;

    /**
     * 当前 document 的节点显隐状态变更事件
     * set callback for event on visibility changed for certain node
     * @param fn
     */
    onChangeNodeVisible(fn: (node: IPublicModelNode, visible: boolean) => void): IPublicTypeDisposable;

    /**
     * 当前 document 的节点 children 变更事件
     * @param fn
     */
    onChangeNodeChildren(fn: (info: IPublicTypeOnChangeOptions) => void): IPublicTypeDisposable;

    /**
     * 当前 document 节点属性修改事件
     * @param fn
     */
    onChangeNodeProp(fn: (info: IPublicTypePropChangeOptions) => void): IPublicTypeDisposable;

    /**
     * import schema event
     * @param fn
     * @since v1.0.15
     */
    onImportSchema(fn: (schema: IPublicTypeRootSchema) => void): IPublicTypeDisposable;

    /**
     * 判断是否当前节点处于被探测状态
     * check is node being detected
     * @param node
     * @since v1.1.0
     */
    isDetectingNode(node: IPublicModelNode): boolean;

    /**
     * 获取当前的 DropLocation 信息
     * get current drop location
     * @since v1.1.0
     */
    get dropLocation(): IPublicModelDropLocation | null;

    /**
     * 设置当前的 DropLocation 信息
     * set current drop location
     * @since v1.1.0
     */
    set dropLocation(loc: IPublicModelDropLocation | null);

    /**
     * 设置聚焦节点变化的回调
     * triggered focused node is set mannually from plugin
     * @param fn
     * @since v1.1.0
     */
    onFocusNodeChanged(
        fn: (doc: IPublicModelDocumentModel, focusNode: IPublicModelNode) => void,
    ): IPublicTypeDisposable;

    /**
     * 设置 DropLocation 变化的回调
     * triggered when drop location changed
     * @param fn
     * @since v1.1.0
     */
    onDropLocationChanged(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable;
}
// eslint-disable-next-line no-shadow
export enum IPublicTypeLocationDetailType {
    Children = 'Children',
    Prop = 'Prop',
}
export type IPublicTypeRect = DOMRect & {
    elements: Array<Element | Text>;
    computed?: boolean;
};
export interface IPublicTypeLocationChildrenDetail {
    type: IPublicTypeLocationDetailType.Children;
    index?: number | null;
    /**
     * 是否有效位置
     */
    valid?: boolean;
    edge?: DOMRect;
    near?: {
        node: IPublicModelNode;
        pos: 'before' | 'after' | 'replace';
        rect?: IPublicTypeRect;
        align?: 'V' | 'H';
    };
    focus?: { type: 'slots' } | { type: 'node'; node: IPublicModelNode };
}

export interface IPublicTypeLocationPropDetail {
    // cover 形态，高亮 domNode，如果 domNode 为空，取 container 的值
    type: IPublicTypeLocationDetailType.Prop;
    name: string;
    domNode?: HTMLElement;
}
export type IPublicTypeLocationDetail = IPublicTypeLocationChildrenDetail | IPublicTypeLocationPropDetail | { type: string;[key: string]: any };

export interface IPublicModelDropLocation {

    /**
     * 拖拽位置目标
     * get target of dropLocation
     */
    get target(): IPublicModelNode | null;

    /**
     * 拖拽放置位置详情
     * get detail of dropLocation
     */
    get detail(): IPublicTypeLocationDetail;

    /**
     * 拖拽放置位置对应的事件
     * get event of dropLocation
     */
    get event(): IPublicModelLocateEvent;

    /**
     * 获取一份当前对象的克隆
     * get a clone object of current dropLocation
     */
    clone(event: IPublicModelLocateEvent): IPublicModelDropLocation;
}
export interface IPublicModelLocateEvent {

    get type(): string;

    /**
     * 浏览器窗口坐标系
     */
    readonly globalX: number;
    readonly globalY: number;

    /**
     * 原始事件
     */
    readonly originalEvent: MouseEvent | DragEvent;

    /**
     * 浏览器事件响应目标
     */
    target?: Element | null;

    canvasX?: number;

    canvasY?: number;

    /**
     * 事件订正标识，初始构造时，从发起端构造，缺少 canvasX,canvasY, 需要经过订正才有
     */
    fixed?: true;

    /**
     * 激活或目标文档
     */
    documentModel?: IPublicModelDocumentModel | null;

    get dragObject(): IPublicModelDragObject | null;
}
export interface IPublicModelDragObject {

    get type(): any;

    get nodes(): any;

    get data(): any;
}

export interface IPublicModelNodeChildren {

    /**
     * 返回当前 children 实例所属的节点实例
     * get owner node of this nodeChildren
     */
    get owner(): IPublicModelNode | null;

    /**
     * children 内的节点实例数
     * get count of child nodes
     */
    get size(): number;

    /**
     * @deprecated please use isEmptyNode
     * 是否为空
     * @returns
     */
    get isEmpty(): boolean;

    /**
     * 是否为空
     * @returns
     */
    get isEmptyNode(): boolean;

    /**
     * @deprecated please use notEmptyNode
     * judge if it is not empty
     */
    get notEmpty(): boolean;

    /**
     * judge if it is not empty
     */
    get notEmptyNode(): boolean;

    /**
     * 删除指定节点
     * delete the node
     * @param node
     */
    delete(node: IPublicModelNode): boolean;

    /**
     * 插入一个节点
     * insert a node at specific position
     * @param node 待插入节点
     * @param at 插入下标
     * @returns
     */
    insert(node: IPublicModelNode, at?: number | null): void;

    /**
     * 返回指定节点的下标
     * get index of node in current children
     * @param node
     * @returns
     */
    indexOf(node: IPublicModelNode): number;

    /**
     * 类似数组 splice 操作
     * provide the same function with {Array.prototype.splice}
     * @param start
     * @param deleteCount
     * @param node
     */
    splice(start: number, deleteCount: number, node?: IPublicModelNode): any;

    /**
     * 返回指定下标的节点
     * get node with index
     * @param index
     * @returns
     */
    get(index: number): IPublicModelNode | null;

    /**
     * 是否包含指定节点
     * check if node exists in current children
     * @param node
     * @returns
     */
    has(node: IPublicModelNode): boolean;

    /**
     * 类似数组的 forEach
     * provide the same function with {Array.prototype.forEach}
     * @param fn
     */
    forEach(fn: (node: IPublicModelNode, index: number) => void): void;

    /**
     * 类似数组的 map
     * provide the same function with {Array.prototype.map}
     * @param fn
     */
    map<T>(fn: (node: IPublicModelNode, index: number) => T[]): any[] | null;

    /**
     * 类似数组的 every
     * provide the same function with {Array.prototype.every}
     * @param fn
     */
    every(fn: (node: IPublicModelNode, index: number) => boolean): boolean;

    /**
     * 类似数组的 some
     * provide the same function with {Array.prototype.some}
     * @param fn
     */
    some(fn: (node: IPublicModelNode, index: number) => boolean): boolean;

    /**
     * 类似数组的 filter
     * provide the same function with {Array.prototype.filter}
     * @param fn
     */
    filter(fn: (node: IPublicModelNode, index: number) => boolean): any;

    /**
     * 类似数组的 find
     * provide the same function with {Array.prototype.find}
     * @param fn
     */
    find(fn: (node: IPublicModelNode, index: number) => boolean): IPublicModelNode | null;

    /**
     * 类似数组的 reduce
     * provide the same function with {Array.prototype.reduce}
     * @param fn
     */
    reduce(fn: (acc: any, cur: IPublicModelNode) => any, initialValue: any): void;

    /**
     * 导入 schema
     * import schema
     * @param data
     */
    importSchema(data?: IPublicTypeNodeData | IPublicTypeNodeData[]): void;

    /**
     * 导出 schema
     * export schema
     * @param stage
     */
    exportSchema(stage: IPublicEnumTransformStage): IPublicTypeNodeSchema;

    /**
     * 执行新增、删除、排序等操作
     * excute remove/add/sort operations
     * @param remover
     * @param adder
     * @param sorter
     */
    mergeChildren(
        remover: (node: IPublicModelNode, idx: number) => boolean,
        adder: (children: IPublicModelNode[]) => IPublicTypeNodeData[] | null,
        sorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number
    ): any;

}

export interface IPublicModelProps {

    /**
     * id
     */
    get id(): string;

    /**
     * 返回当前 props 的路径
     * return path of current props
     */
    get path(): string[];

    /**
     * 返回所属的 node 实例
     */
    get node(): IPublicModelNode | null;

    /**
     * 获取指定 path 的属性模型实例
     * get prop by path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     */
    getProp(path: string): IPublicModelProp | null;

    /**
     * 获取指定 path 的属性模型实例值
     * get value of prop by path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     */
    getPropValue(path: string): any;

    /**
     * 获取指定 path 的属性模型实例，
     *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
     * get extra prop by path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     */
    getExtraProp(path: string): IPublicModelProp | null;

    /**
     * 获取指定 path 的属性模型实例值
     *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
     * get value of extra prop by path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     */
    getExtraPropValue(path: string): any;

    /**
     * 设置指定 path 的属性模型实例值
     * set value of prop by path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     * @param value 值
     */
    setPropValue(path: string, value: IPublicTypeCompositeValue): void;

    /**
     * 设置指定 path 的属性模型实例值
     * set value of extra prop by path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     * @param value 值
     */
    setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void;

    /**
     * 当前 props 是否包含某 prop
     * check if the specified key is existing or not.
     * @param key
     * @since v1.1.0
     */
    has(key: string): boolean;

    /**
     * 添加一个 prop
     * add a key with given value
     * @param value
     * @param key
     * @since v1.1.0
     */
    add(value: IPublicTypeCompositeValue, key?: string | number | undefined): any;

}
export type IPublicTypePropsList = Array<{
    spread?: boolean;
    name?: string;
    value: IPublicTypeCompositeValue;
}>;
export interface IPublicModelExclusiveGroup {
    readonly id: string;
    readonly title: string;
    get firstNode(): IPublicModelNode;
    setVisible(node: Node): void;
}
// eslint-disable-next-line no-shadow
export enum IPublicEnumPropValueChangedType {
    /**
     * normal set value
     */
    SET_VALUE = 'SET_VALUE',
    /**
     * value changed caused by sub-prop value change
     */
    SUB_VALUE_CHANGE = 'SUB_VALUE_CHANGE'
}
export interface IPublicTypeSetValueOptions {
    disableMutator?: boolean;
    type?: IPublicEnumPropValueChangedType;
    fromSetHotValue?: boolean;
}
export type IPublicTypeDynamicProps = (target: IPublicModelSettingTarget) => Record<string, unknown>;

/**
 * 设置器配置
 */
export interface IPublicTypeSetterConfig {
    // if *string* passed must be a registered Setter Name
    /**
     * 配置设置器用哪一个 setter
     */
    componentName: string | IPublicTypeCustomView;
    /**
     * 传递给 setter 的属性
     *
     * the props pass to Setter Component
     */
    props?: Record<string, unknown> | IPublicTypeDynamicProps;
    /**
     * @deprecated
     */
    children?: any;
    /**
     * 是否必填？
     *
     * ArraySetter 里有个快捷预览，可以在不打开面板的情况下直接编辑
     */
    isRequired?: boolean;
    /**
     * Setter 的初始值
     *
     * @todo initialValue 可能要和 defaultValue 二选一
     */
    initialValue?: any | ((target: IPublicModelSettingTarget) => any);
    // for MixedSetter
    /**
     * 给 MixedSetter 时切换 Setter 展示用的
     */
    title?: IPublicTypeTitleContent;
    // for MixedSetter check this is available
    /**
     * 给 MixedSetter 用于判断优先选中哪个
     */
    condition?: (target: IPublicModelSettingTarget) => boolean;
    /**
     * 给 MixedSetter，切换值时声明类型
     *
     * @todo 物料协议推进
     */
    valueType?: IPublicTypeCompositeValue[];
    // 标识是否为动态 setter，默认为 true
    isDynamic?: boolean;
}
// eslint-disable-next-line max-len
export type IPublicTypeSetterType = IPublicTypeSetterConfig | IPublicTypeSetterConfig[] | string | IPublicTypeCustomView;

export interface IPublicModelSettingPropEntry {

    /**
     * 获取设置属性的 isGroup
     */
    get isGroup(): boolean;

    /**
     * 获取设置属性的 id
     */
    get id(): string;

    /**
     * 获取设置属性的 name
     */
    get name(): string | number;

    /**
     * 获取设置属性的 key
     */
    get key(): string | number;

    /**
     * 获取设置属性的 path
     */
    get path(): any[];

    /**
     * 获取设置属性的 title
     */
    get title(): any;

    /**
     * 获取设置属性的 setter
     */
    get setter(): IPublicTypeSetterType | null;

    /**
     * 获取设置属性的 expanded
     */
    get expanded(): boolean;

    /**
     * 获取设置属性的 extraProps
     */
    get extraProps(): IPublicTypeFieldExtraProps;

    get props(): IPublicModelSettingTopEntry;

    /**
     * 获取设置属性对应的节点实例
     */
    get node(): IPublicModelNode | null;

    /**
     * 获取设置属性的父设置属性
     */
    get parent(): IPublicModelSettingPropEntry;

    /**
     * 获取顶级设置属性
     */
    get top(): IPublicModelSettingTopEntry;

    /**
     * 是否是 SettingField 实例
     */
    get isSettingField(): boolean;

    /**
     * componentMeta
     */
    get componentMeta(): IPublicModelComponentMeta | null;

    /**
     * 获取设置属性的 items
     */
    get items(): Array<IPublicModelSettingPropEntry | IPublicTypeCustomView>;

    /**
     * 设置 key 值
     * @param key
     */
    setKey(key: string | number): void;

    /**
     * 设置值
     * @param val 值
     */
    setValue(val: IPublicTypeCompositeValue, extraOptions?: IPublicTypeSetValueOptions): void;

    /**
     * 设置子级属性值
     * @param propName 子属性名
     * @param value 值
     */
    setPropValue(propName: string | number, value: any): void;

    /**
     * 清空指定属性值
     * @param propName
     */
    clearPropValue(propName: string | number): void;

    /**
     * 获取配置的默认值
     * @returns
     */
    getDefaultValue(): any;

    /**
     * 获取值
     * @returns
     */
    getValue(): any;

    /**
     * 获取子级属性值
     * @param propName 子属性名
     * @returns
     */
    getPropValue(propName: string | number): any;

    /**
     * 获取顶层附属属性值
     */
    getExtraPropValue(propName: string): any;

    /**
     * 设置顶层附属属性值
     */
    setExtraPropValue(propName: string, value: any): void;

    /**
     * 获取设置属性集
     * @returns
     */
    getProps(): IPublicModelSettingTopEntry;

    /**
     * 是否绑定了变量
     * @returns
     */
    isUseVariable(): boolean;

    /**
     * 设置绑定变量
     * @param flag
     */
    setUseVariable(flag: boolean): void;

    /**
     * 创建一个设置 field 实例
     * @param config
     * @returns
     */
    createField(config: IPublicTypeFieldConfig): IPublicModelSettingPropEntry;

    /**
     * 获取值，当为变量时，返回 mock
     * @returns
     */
    getMockOrValue(): any;

    /**
     * 销毁当前 field 实例
     */
    purge(): void;

    /**
     * 移除当前 field 实例
     */
    remove(): void;

    /**
     * 设置 autorun
     * @param action
     * @returns
     */
    onEffect(action: () => void): () => void;
}
export interface IPublicModelSettingTopEntry {

    /**
     * 返回所属的节点实例
     */
    get node(): IPublicModelNode | null;

    /**
     * 获取子级属性对象
     * @param propName
     * @returns
     */
    get(propName: string | number): IPublicModelSettingPropEntry;

    /**
     * 获取指定 propName 的值
     * @param propName
     * @returns
     */
    getPropValue(propName: string | number): any;

    /**
     * 设置指定 propName 的值
     * @param propName
     * @param value
     */
    setPropValue(propName: string | number, value: any): void;
}
export interface IPublicModelNode {

    /**
     * 节点 id
     * node id
     */
    id: string;

    /**
     * 节点标题
     * title of node
     */
    get title(): string | IPublicTypeI18nData | ReactElement;

    /**
     * @deprecated please use isContainerNode
     */
    get isContainer(): boolean;

    /**
     * 是否为「容器型」节点
     * check if node is a container type node
     * @since v1.1.0
     */
    get isContainerNode(): boolean;

    /**
     * @deprecated please use isRootNode
     */
    get isRoot(): boolean;

    /**
     * 是否为根节点
     * check if node is root in the tree
     * @since v1.1.0
     */
    get isRootNode(): boolean;

    /**
     * @deprecated please use isEmptyNode
     */
    get isEmpty(): boolean;

    /**
     * 是否为空节点（无 children 或者 children 为空）
     * check if current node is empty, which means no children or children is empty
     * @since v1.1.0
     */
    get isEmptyNode(): boolean;

    /**
     * @deprecated please use isPageNode
     * 是否为 Page 节点
     */
    get isPage(): boolean;

    /**
     * 是否为 Page 节点
     * check if node is Page
     * @since v1.1.0
     */
    get isPageNode(): boolean;

    /**
     * @deprecated please use isComponentNode
     */
    get isComponent(): boolean;

    /**
     * 是否为 Component 节点
     * check if node is Component
     * @since v1.1.0
     */
    get isComponentNode(): boolean;

    /**
     * @deprecated please use isModalNode
     */
    get isModal(): boolean;

    /**
     * 是否为「模态框」节点
     * check if node is Modal
     * @since v1.1.0
     */
    get isModalNode(): boolean;

    /**
     * @deprecated please use isSlotNode
     */
    get isSlot(): boolean;

    /**
     * 是否为插槽节点
     * check if node is a Slot
     * @since v1.1.0
     */
    get isSlotNode(): boolean;

    /**
     * @deprecated please use isParentalNode
     */
    get isParental(): boolean;

    /**
     * 是否为父类/分支节点
     * check if node a parental node
     * @since v1.1.0
     */
    get isParentalNode(): boolean;

    /**
     * @deprecated please use isLeafNode
     */
    get isLeaf(): boolean;

    /**
     * 是否为叶子节点
     * check if node is a leaf node in tree
     * @since v1.1.0
     */
    get isLeafNode(): boolean;

    /**
     * 获取当前节点的锁定状态
     * check if current node is locked
     * @since v1.0.16
     */
    get isLocked(): boolean;

    /**
     * @deprecated please use isRGLContainerNode
     */
    set isRGLContainer(flag: boolean);

    /**
     * @deprecated please use isRGLContainerNode
     * @returns Boolean
     */
    get isRGLContainer();

    /**
     * 设置为磁贴布局节点
     * @since v1.1.0
     */
    set isRGLContainerNode(flag: boolean);

    /**
     * 获取磁贴布局节点设置状态
     * @returns Boolean
     * @since v1.1.0
     */
    get isRGLContainerNode();

    /**
     * 下标
     * index
     */
    get index(): number;

    /**
     * 图标
     * get icon of this node
     */
    get icon(): IPublicTypeIconType;

    /**
     * 节点所在树的层级深度，根节点深度为 0
     * depth level of this node, value of root node is 0
     */
    get zLevel(): number;

    /**
     * 节点 componentName
     * componentName
     */
    get componentName(): string;

    /**
     * 节点的物料元数据
     * get component meta of this node
     */
    get componentMeta(): IPublicModelComponentMeta | null;

    /**
     * 获取节点所属的文档模型对象
     * get documentModel of this node
     */
    get document(): IPublicModelDocumentModel | null;

    /**
     * 获取当前节点的前一个兄弟节点
     * get previous sibling of this node
     */
    get prevSibling(): IPublicModelNode | null;

    /**
     * 获取当前节点的后一个兄弟节点
     * get next sibling of this node
     */
    get nextSibling(): IPublicModelNode | null;

    /**
     * 获取当前节点的父亲节点
     * get parent of this node
     */
    get parent(): IPublicModelNode | null;

    /**
     * 获取当前节点的孩子节点模型
     * get children of this node
     */
    get children(): IPublicModelNodeChildren | null;

    /**
     * 节点上挂载的插槽节点们
     * get slots of this node
     */
    get slots(): IPublicModelNode[];

    /**
     * 当前节点为插槽节点时，返回节点对应的属性实例
     * return coresponding prop when this node is a slot node
     */
    get slotFor(): IPublicModelProp | null;

    /**
     * 返回节点的属性集
     * get props
     */
    get props(): IPublicModelProps | null;

    /**
     * 返回节点的属性集
     * get props data
     */
    get propsData(): IPublicTypePropsMap | IPublicTypePropsList | null;

    /**
     * get conditionGroup
     */
    get conditionGroup(): IPublicModelExclusiveGroup | null;

    /**
     * 获取符合搭建协议 - 节点 schema 结构
     * get schema of this node
     * @since v1.1.0
     */
    get schema(): IPublicTypeNodeSchema;

    /**
     * 获取对应的 setting entry
     * get setting entry of this node
     * @since v1.1.0
     */
    get settingEntry(): IPublicModelSettingTopEntry;

    /**
     * 返回节点的尺寸、位置信息
     * get rect information for this node
     */
    getRect(): DOMRect | null;

    /**
     * 是否有挂载插槽节点
     * check if current node has slots
     */
    hasSlots(): boolean;

    /**
     * 是否设定了渲染条件
     * check if current node has condition value set
     */
    hasCondition(): boolean;

    /**
     * 是否设定了循环数据
     * check if loop is set for this node
     */
    hasLoop(): boolean;

    /**
     * 获取指定 path 的属性模型实例
     * get prop by path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     */
    getProp(path: string, createIfNone: boolean): IPublicModelProp | null;

    /**
     * 获取指定 path 的属性模型实例值
     * get prop value by path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     */
    getPropValue(path: string): any;

    /**
     * 获取指定 path 的属性模型实例，
     *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
     *
     * get extra prop by path, an extra prop means a prop not exists in the `props`
     * but as siblint of the `props`
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     * @param createIfNone 当没有属性的时候，是否创建一个属性
     */
    getExtraProp(path: string, createIfNone?: boolean): IPublicModelProp | null;

    /**
     * 获取指定 path 的属性模型实例，
     *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
     *
     * get extra prop value by path, an extra prop means a prop not exists in the `props`
     * but as siblint of the `props`
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     * @returns
     */
    getExtraPropValue(path: string): any;

    /**
     * 设置指定 path 的属性模型实例值
     * set value for prop with path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     * @param value 值
     */
    setPropValue(path: string, value: IPublicTypeCompositeValue): void;

    /**
     * 设置指定 path 的属性模型实例值
     * set value for extra prop with path
     * @param path 属性路径，支持 a / a.b / a.0 等格式
     * @param value 值
     */
    setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void;

    /**
     * 导入节点数据
     * import node schema
     * @param data
     */
    importSchema(data: IPublicTypeNodeSchema): void;

    /**
     * 导出节点数据
     * export schema from this node
     * @param stage
     * @param options
     */
    exportSchema(stage: IPublicEnumTransformStage, options?: any): IPublicTypeNodeSchema;

    /**
     * 在指定位置之前插入一个节点
     * insert a node befor current node
     * @param node
     * @param ref
     * @param useMutator
     */
    insertBefore(
        node: IPublicModelNode,
        ref?: IPublicModelNode | undefined,
        useMutator?: boolean,
    ): void;

    /**
     * 在指定位置之后插入一个节点
     * insert a node after this node
     * @param node
     * @param ref
     * @param useMutator
     */
    insertAfter(
        node: IPublicModelNode,
        ref?: IPublicModelNode | undefined,
        useMutator?: boolean,
    ): void;

    /**
     * 替换指定节点
     * replace a child node with data provided
     * @param node 待替换的子节点
     * @param data 用作替换的节点对象或者节点描述
     * @returns
     */
    replaceChild(node: IPublicModelNode, data: any): IPublicModelNode | null;

    /**
     * 将当前节点替换成指定节点描述
     * replace current node with a new node schema
     * @param schema
     */
    replaceWith(schema: IPublicTypeNodeSchema): any;

    /**
     * 选中当前节点实例
     * select current node
     */
    select(): void;

    /**
     * 设置悬停态
     * set hover value for current node
     * @param flag
     */
    hover(flag: boolean): void;

    /**
     * 设置节点锁定状态
     * set lock value for current node
     * @param flag
     * @since v1.0.16
     */
    lock(flag?: boolean): void;

    /**
     * 删除当前节点实例
     * remove current node
     */
    remove(): void;

    /**
     * 执行新增、删除、排序等操作
     * excute remove/add/sort operations on node`s children
     *
     * @since v1.1.0
     */
    mergeChildren(
        remover: (node: IPublicModelNode, idx: number) => boolean,
        adder: (children: IPublicModelNode[]) => any,
        sorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number
    ): any;

    /**
     * 当前节点是否包含某子节点
     * check if current node contains another node as a child
     * @param node
     * @since v1.1.0
     */
    contains(node: IPublicModelNode): boolean;

    /**
     * 是否可执行某 action
     * check if current node can perform certain aciton with actionName
     * @param actionName action 名字
     * @since v1.1.0
     */
    canPerformAction(actionName: string): boolean;

    /**
     * 当前节点是否可见
     * check if current node is visible
     * @since v1.1.0
     */
    get visible(): boolean;

    /**
     * 设置当前节点是否可见
     * set visible value for current node
     * @since v1.1.0
     */
    set visible(value: boolean);

    /**
     * 获取该节点的 ConditionalVisible 值
     * check if current node ConditionalVisible
     * @since v1.1.0
     */
    isConditionalVisible(): boolean | undefined;

    /**
     * 设置该节点的 ConditionalVisible 为 true
     * make this node as conditionalVisible === true
     * @since v1.1.0
     */
    setConditionalVisible(): void;
}

export interface IPublicModelProp {

    /**
     * id
     */
    get id(): string;

    /**
     * key 值
     * get key of prop
     */
    get key(): string | number | undefined;

    /**
     * 返回当前 prop 的路径
     * get path of current prop
     */
    get path(): string[];

    /**
     * 返回所属的节点实例
     * get node instance, which this prop belongs to
     */
    get node(): IPublicModelNode | null;

    /**
     * 当本 prop 代表一个 Slot 时，返回对应的 slotNode
     * return the slot node (only if the current prop represents a slot)
     * @since v1.1.0
     */
    get slotNode(): IPublicModelNode | undefined | null;

    /**
     * 是否是 Prop , 固定返回 true
     * check if it is a prop or not, and of course always return true
     * @experimental
     */
    get isProp(): boolean;

    /**
     * 设置值
     * set value for this prop
     * @param val
     */
    setValue(val: IPublicTypeCompositeValue): void;

    /**
     * 获取值
     * get value of this prop
     */
    getValue(): any;

    /**
     * 移除值
     * remove value of this prop
     * @since v1.0.16
     */
    remove(): void;

    /**
     * 导出值
     * export schema
     * @param stage
     */
    exportSchema(stage: IPublicEnumTransformStage): IPublicTypeCompositeValue;
}

export interface IPublicTypeFilterItem {
    name: string;
    filter: (target: IPublicModelSettingTarget | null, currentValue: any) => any;
}
export interface IPublicTypeAutorunItem {
    name: string;
    autorun: (prop: IPublicModelProp) => any;
}
/**
* 高级特性配置
*/
export interface IPublicTypeAdvanced {

    /**
     * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
     * callbacks/hooks which can be used to do
     * things on some special ocations like onNodeAdd or onResize
     */
    callbacks?: IPublicTypeCallbacks;

    /**
     * 拖入容器时，自动带入 children 列表
     */
    initialChildren?: IPublicTypeNodeData[] | ((target: IPublicModelSettingTarget) => IPublicTypeNodeData[]);

    /**
     * 样式 及 位置，handle 上必须有明确的标识以便事件路由判断，或者主动设置事件独占模式
     * NWSE 是交给引擎计算放置位置，ReactElement 必须自己控制初始位置
     *
     * 用于配置设计器中组件 resize 操作工具的样式和内容
     * - hover 时控制柄高亮
     * - mousedown 时请求独占
     * - dragstart 请求通用 resizing 控制 请求 hud 显示
     * - drag 时 计算并设置效果，更新控制柄位置
     */
    getResizingHandlers?: (
        currentNode: any
    ) => (Array<{
        type: 'N' | 'W' | 'S' | 'E' | 'NW' | 'NE' | 'SE' | 'SW';
        content?: ReactElement;
        propTarget?: string;
        appearOn?: 'mouse-enter' | 'mouse-hover' | 'selected' | 'always';
    }> |
        ReactElement[]);

    /**
     * @deprecated 用于动态初始化拖拽到设计器里的组件的 prop 的值
     */
    initials?: IPublicTypeInitialItem[];

    /**
     * @deprecated 使用组件 metadata 上的 snippets 字段即可
     */
    snippets?: IPublicTypeSnippet[];

    /**
     * 是否绝对布局容器，还未进入协议
     * @experimental not in spec yet
     */
    isAbsoluteLayoutContainer?: boolean;

    /**
     * hide bem tools when selected
     * @experimental not in spec yet
     */
    hideSelectTools?: boolean;

    /**
     * Live Text Editing：如果 children 内容是纯文本，支持双击直接编辑
     * @experimental not in spec yet
     */
    liveTextEditing?: IPublicTypeLiveTextEditingConfig[];

    /**
     * TODO: 补充文档
     * @experimental not in spec yet
     */
    view?: ComponentType<any>;

    /**
     * @legacy capability for vision
     * @deprecated
     */
    isTopFixed?: boolean;

    /**
     * TODO: 补充文档 或 删除
     * @deprecated not used anywhere, dont know what is it for
     */
    context?: { [contextInfoName: string]: any };

    /**
     * @legacy capability for vision
     * @deprecated
     */
    filters?: IPublicTypeFilterItem[];

    /**
     * @legacy capability for vision
     * @deprecated
     */
    autoruns?: IPublicTypeAutorunItem[];

    /**
     * @legacy capability for vision
     * @deprecated
     */
    transducers?: any;
}
export interface IPublicTypeOneOf {
    type: 'oneOf';
    value: string[];
    isRequired?: boolean;
}
export interface IPublicTypeOneOfType {
    type: 'oneOfType';
    value: IPublicTypePropType[];
    isRequired?: boolean;
}
export interface IPublicTypeArrayOf {
    type: 'arrayOf';
    value: IPublicTypePropType;
    isRequired?: boolean;
}
export interface IPublicTypeObjectOf {
    type: 'objectOf';
    value: IPublicTypePropType;
    isRequired?: boolean;
}
export interface IPublicTypeShape {
    type: 'shape';
    value: IPublicTypePropConfig[];
    isRequired?: boolean;
}
export interface IPublicTypeExact {
    type: 'exact';
    value: IPublicTypePropConfig[];
    isRequired?: boolean;
}
export type IPublicTypeComplexType = IPublicTypeOneOf | IPublicTypeOneOfType | IPublicTypeArrayOf | IPublicTypeObjectOf | IPublicTypeShape | IPublicTypeExact;

export type IPublicTypePropType = IPublicTypeBasicType | IPublicTypeRequiredType | IPublicTypeComplexType;
export interface IPublicTypeRequiredType {
    type: IPublicTypeBasicType;
    isRequired?: boolean;
}
export type IPublicTypeBasicType = 'array' | 'bool' | 'func' | 'number' | 'object' | 'string' | 'node' | 'element' | 'any';

/**
 * 组件属性信息
 */
export interface IPublicTypePropConfig {
    /**
     * 属性名称
     */
    name: string;
    /**
     * 属性类型
     */
    propType: IPublicTypePropType;
    /**
     * 属性描述
     */
    description?: string;
    /**
     * 属性默认值
     */
    defaultValue?: any;
    /**
     * @deprecated 已被弃用
     */
    setter?: any;
}
/**
 * 组件 meta 配置
 */

export interface IPublicTypeComponentMetadata {
    /**
     * 组件名
     */
    componentName: string;
    /**
     * unique id
     */
    uri?: string;
    /**
     * title or description
     */
    title?: IPublicTypeTitleContent;
    /**
     * svg icon for component
     */
    icon?: IPublicTypeIconType;
    /**
     * 组件标签
     */
    tags?: string[];
    /**
     * 组件描述
     */
    description?: string;
    /**
     * 组件文档链接
     */
    docUrl?: string;
    /**
     * 组件快照
     */
    screenshot?: string;
    /**
     * 组件研发模式
     */
    devMode?: 'proCode' | 'lowCode';
    /**
     * npm 源引入完整描述对象
     */
    npm?: IPublicTypeNpmInfo;
    /**
     * 组件属性信息
     */
    props?: IPublicTypePropConfig[];
    /**
     * 编辑体验增强
     */
    configure?: IPublicTypeFieldConfig[] | IPublicTypeConfigure;
    /**
     * @deprecated, use advanced instead
     */
    experimental?: IPublicTypeAdvanced;
    /**
     * @todo 待补充文档
     */
    schema?: IPublicTypeComponentSchema;
    /**
     * 可用片段
     */
    snippets?: IPublicTypeSnippet[];
    /**
     * 一级分组
     */
    group?: string | IPublicTypeI18nData;
    /**
     * 二级分组
     */
    category?: string | IPublicTypeI18nData;
    /**
     * 组件优先级排序
     */
    priority?: number;
}

export interface IPublicTypeComponentDescription extends IPublicTypeComponentMetadata {
    /**
     * @todo 待补充文档 @jinchan
     */
    keywords: string[];
    /**
     * 替代 npm 字段的升级版本
     */
    reference?: IPublicTypeReference;
}
/**
* 远程物料描述
*/
export interface IPublicTypeRemoteComponentDescription extends IPublicTypeComponentMetadata {
    /**
     * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
     */
    exportName?: string;
    /**
     * 组件描述的资源链接；
     */
    url?: string;
    /**
     * 组件 (库) 的 npm 信息；
     */
    package?: {
        npm?: string;
    };

    /**
     * 替代 npm 字段的升级版本
     */
    reference?: IPublicTypeReference;
}

export interface IPublicTypeAssetsJson {
    /**
     * 资产包协议版本号
     */
    version: string;
    /**
     * 大包列表，external 与 package 的概念相似，融合在一起
     */
    packages?: IPublicTypePackage[];
    /**
     * 所有组件的描述协议列表所有组件的列表
     */
    components: Array<IPublicTypeComponentDescription | IPublicTypeRemoteComponentDescription>;
    /**
     * 组件分类列表，用来描述物料面板
     * @deprecated 最新版物料面板已不需要此描述
     */
    componentList?: any[];
    /**
     * 业务组件分类列表，用来描述物料面板
     * @deprecated 最新版物料面板已不需要此描述
     */
    bizComponentList?: any[];
    /**
     * 用于描述组件面板中的 tab 和 category
     */
    sort?: IPublicTypeComponentSort;
}
/**
 * npm 源引入完整描述对象
 */
export interface IPublicTypeNpmInfo {
    /**
     * 源码组件名称
     */
    componentName?: string;
    /**
     * 源码组件库名
     */
    package: string;
    /**
     * 源码组件版本号
     */
    version?: string;
    /**
     * 是否解构
     */
    destructuring?: boolean;
    /**
     * 源码组件名称
     */
    exportName?: string;
    /**
     * 子组件名
     */
    subName?: string;
    /**
     * 组件路径
     */
    main?: string;
}
/**
* extra props for field
*/
export interface IPublicTypeFieldExtraProps {
    /**
     * 是否必填参数
     */
    isRequired?: boolean;
    /**
     * default value of target prop for setter use
     */
    defaultValue?: any;
    /**
     * get value for field
     */
    getValue?: (target: IPublicModelSettingTarget, fieldValue: any) => any;
    /**
     * set value for field
     */
    setValue?: (target: IPublicModelSettingTarget, value: any) => void;
    /**
     * the field conditional show, is not set always true
     * @default undefined
     */
    condition?: (target: IPublicModelSettingTarget) => boolean;
    /**
     * autorun when something change
     */
    autorun?: (target: IPublicModelSettingTarget) => void;
    /**
     * is this field is a virtual field that not save to schema
     */
    virtual?: (target: IPublicModelSettingTarget) => boolean;
    /**
     * default collapsed when display accordion
     */
    defaultCollapsed?: boolean;
    /**
     * important field
     */
    important?: boolean;
    /**
     * internal use
     */
    forceInline?: number;
    /**
     * 是否支持变量配置
     */
    supportVariable?: boolean;
    /**
     * compatiable vision display
     */
    display?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry';
    // @todo 这个 omit 是否合理？
    /**
     * @todo 待补充文档
     */
    liveTextEditing?: Omit<IPublicTypeLiveTextEditingConfig, 'propTarget'>;

    /**
     * onChange 事件
     */
    onChange?: (value: any, field: any) => void;
}
export type IPublicTypeDynamicSetter = (target: IPublicModelSettingTarget) => string | IPublicTypeSetterConfig | IPublicTypeCustomView;
/**
 * 属性面板配置
 */
export interface IPublicTypeFieldConfig extends IPublicTypeFieldExtraProps {

    /**
     * 面板配置隶属于单个 field 还是分组
     */
    type?: 'field' | 'group';

    /**
     * the name of this setting field, which used in quickEditor
     */
    name: string | number;

    /**
     * the field title
     * @default sameas .name
     */
    title?: IPublicTypeTitleContent;

    /**
     * 单个属性的 setter 配置
     *
     * the field body contains when .type = 'field'
     */
    setter?: IPublicTypeSetterType | IPublicTypeDynamicSetter;

    /**
     * the setting items which group body contains when .type = 'group'
     */
    items?: IPublicTypeFieldConfig[];

    /**
     * extra props for field
     * 其他配置属性（不做流通要求）
     */
    extraProps?: IPublicTypeFieldExtraProps;

    /**
     * @deprecated
     */
    description?: IPublicTypeTitleContent;

    /**
     * @deprecated
     */
    isExtends?: boolean;
}
/**
 * 嵌套控制函数
 */
export type IPublicTypeNestingFilter = (testNode: any, currentNode: any) => boolean;
/**
 * 嵌套控制
 * 防止错误的节点嵌套，比如 a 嵌套 a, FormField 只能在 Form 容器下，Column 只能在 Table 下等
 */
export interface IPublicTypeNestingRule {

    /**
     * 子级白名单
     */
    childWhitelist?: string[] | string | RegExp | IPublicTypeNestingFilter;

    /**
     * 父级白名单
     */
    parentWhitelist?: string[] | string | RegExp | IPublicTypeNestingFilter;

    /**
     * 后裔白名单
     */
    descendantWhitelist?: string[] | string | RegExp | IPublicTypeNestingFilter;

    /**
     * 后裔黑名单
     */
    descendantBlacklist?: string[] | string | RegExp | IPublicTypeNestingFilter;

    /**
     * 祖先白名单 可用来做区域高亮
     */
    ancestorWhitelist?: string[] | string | RegExp | IPublicTypeNestingFilter;
}
/**
 * 组件能力配置
 */
export interface IPublicTypeComponentConfigure {

    /**
     * 是否容器组件
     */
    isContainer?: boolean;

    /**
     * 组件是否带浮层，浮层组件拖入设计器时会遮挡画布区域，此时应当辅助一些交互以防止阻挡
     */
    isModal?: boolean;

    /**
     * 是否存在渲染的根节点
     */
    isNullNode?: boolean;

    /**
     * 组件树描述信息
     */
    descriptor?: string;

    /**
     * 嵌套控制：防止错误的节点嵌套
     * 比如 a 嵌套 a, FormField 只能在 Form 容器下，Column 只能在 Table 下等
     */
    nestingRule?: IPublicTypeNestingRule;

    /**
     * 是否是最小渲染单元
     * 最小渲染单元下的组件渲染和更新都从单元的根节点开始渲染和更新。如果嵌套了多层最小渲染单元，渲染会从最外层的最小渲染单元开始渲染。
     */
    isMinimalRenderUnit?: boolean;

    /**
     * 组件选中框的 cssSelector
     */
    rootSelector?: string;

    /**
     * 禁用的行为，可以为 `'copy'`, `'move'`, `'remove'` 或它们组成的数组
     */
    disableBehaviors?: string[] | string;

    /**
     * 用于详细配置上述操作项的内容
     */
    actions?: IPublicTypeComponentAction[];
}
export type ConfigureSupportEvent = string | {
    name: string;
    propType?: IPublicTypePropType;
    description?: string;
};
/**
 * 通用扩展面板支持性配置
 */
export interface ConfigureSupport {

    /**
     * 支持事件列表
     */
    events?: ConfigureSupportEvent[];

    /**
     * 支持 className 设置
     */
    className?: boolean;

    /**
     * 支持样式设置
     */
    style?: boolean;

    /**
     * 支持生命周期设置
     */
    lifecycles?: any[];

    // general?: boolean;
    /**
     * 支持循环设置
     */
    loop?: boolean;

    /**
     * 支持条件式渲染设置
     */
    condition?: boolean;
}
/**
* 编辑体验配置
*/
export interface IPublicTypeConfigure {

    /**
     * 属性面板配置
     */
    props?: IPublicTypeFieldConfig[];

    /**
     * 组件能力配置
     */
    component?: IPublicTypeComponentConfigure;

    /**
     * 通用扩展面板支持性配置
     */
    supports?: ConfigureSupport;

    /**
     * 高级特性配置
     */
    advanced?: IPublicTypeAdvanced;
}

export interface IPublicTypeTransformedComponentMetadata extends IPublicTypeComponentMetadata {
    configure: IPublicTypeConfigure & { combined?: IPublicTypeFieldConfig[] };
}

export interface IPublicTypeMetadataTransducer {
    (prev: IPublicTypeTransformedComponentMetadata): IPublicTypeTransformedComponentMetadata;
    /**
     * 0 - 9   system
     * 10 - 99 builtin-plugin
     * 100 -   app & plugin
     */
    level?: number;
    /**
     * use to replace TODO
     */
    id?: string;
}

export interface IPublicApiMaterial {
    /**
     * 获取组件 map 结构
     * get map of components
     */
    get componentsMap(): {
        [key: string]: IPublicTypeNpmInfo | ComponentType<any> | object;
    };
    /**
     * 设置「资产包」结构
     * set data for Assets
     * @returns void
     */
    setAssets(assets: IPublicTypeAssetsJson): void;
    /**
     * 获取「资产包」结构
     * get AssetsJson data
     * @returns IPublicTypeAssetsJson
     */
    getAssets(): IPublicTypeAssetsJson;
    /**
     * 加载增量的「资产包」结构，该增量包会与原有的合并
     * load Assets incrementally, and will merge this with exiting assets
     * @param incrementalAssets
     * @returns
     */
    loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): void;
    /**
     * 注册物料元数据管道函数，在物料信息初始化时执行。
     * register transducer to process component meta, which will be
     * excuted during component meta`s initialization
     * @param transducer
     * @param level
     * @param id
     */
    registerMetadataTransducer(transducer: IPublicTypeMetadataTransducer, level?: number, id?: string | undefined): void;
    /**
     * 获取所有物料元数据管道函数
     * get all registered metadata transducers
     * @returns {IPublicTypeMetadataTransducer[]}
     */
    getRegisteredMetadataTransducers(): IPublicTypeMetadataTransducer[];
    /**
     * 获取指定名称的物料元数据
     * get component meta by component name
     * @param componentName
     * @returns
     */
    getComponentMeta(componentName: string): IPublicModelComponentMeta | null;
    /**
     * test if the given object is a ComponentMeta instance or not
     * @param obj
     * @experiemental unstable API, pay extra caution when trying to use it
     */
    isComponentMeta(obj: any): boolean;
    /**
     * 获取所有已注册的物料元数据
     * get map of all component metas
     */
    getComponentMetasMap(): Map<string, IPublicModelComponentMeta>;
    /**
     * 在设计器辅助层增加一个扩展 action
     * add an action button in canvas context menu area
     * @param action
     */
    addBuiltinComponentAction(action: IPublicTypeComponentAction): void;
    /**
     * 移除设计器辅助层的指定 action
     * remove a builtin action button from canvas context menu area
     * @param name
     */
    removeBuiltinComponentAction(name: string): void;
    /**
     * 修改已有的设计器辅助层的指定 action
     * modify a builtin action button in canvas context menu area
     * @param actionName
     * @param handle
     */
    modifyBuiltinComponentAction(actionName: string, handle: (action: IPublicTypeComponentAction) => void): void;
    /**
     * 监听 assets 变化的事件
     * add callback for assets changed event
     * @param fn
     */
    onChangeAssets(fn: () => void): IPublicTypeDisposable;
}
// eslint-disable-next-line no-shadow
export enum IPublicEnumTransitionType {
    /** 节点更新后重绘处理 */
    REPAINT
}

export interface IPublicApiCommonUtils {
    /**
     * 是否为合法的 schema 结构
     * check if data is valid NodeSchema
     *
     * @param {*} data
     * @returns {boolean}
     */
    isNodeSchema(data: any): boolean;

    /**
     * 是否为表单事件类型
     * check if e is a form event
     * @param {(KeyboardEvent | MouseEvent)} e
     * @returns {boolean}
     */
    isFormEvent(e: KeyboardEvent | MouseEvent): boolean;

    /**
     * 从 schema 结构中查找指定 id 节点
     * get node schema from a larger schema with node id
     * @param {IPublicTypeNodeSchema} schema
     * @param {string} nodeId
     * @returns {(IPublicTypeNodeSchema | undefined)}
     */
    getNodeSchemaById(
        schema: IPublicTypeNodeSchema,
        nodeId: string,
    ): IPublicTypeNodeSchema | undefined;

    // TODO: add comments
    getConvertedExtraKey(key: string): string;

    // TODO: add comments
    getOriginalExtraKey(key: string): string;

    /**
     * 批处理事务，用于优化特定场景的性能
     * excute something in a transaction for performence
     *
     * @param {() => void} fn
     * @param {IPublicEnumTransitionType} type
     * @since v1.0.16
     */
    executeTransaction(fn: () => void, type: IPublicEnumTransitionType): void;

    /**
     * i18n 相关工具
     * i18n tools
     *
     * @param {(string | object)} instance
     * @returns {{
     *     intlNode(id: string, params?: object): ReactNode;
     *     intl(id: string, params?: object): string;
     *     getLocale(): string;
     *     setLocale(locale: string): void;
     *   }}
     * @since v1.0.17
     */
    createIntl(instance: string | object): {
        intlNode(id: string, params?: object): ReactNode;
        intl(id: string, params?: object): string;
        getLocale(): string;
        setLocale(locale: string): void;
    };
}

export interface IPublicApiCommon {

    get utils(): IPublicApiCommonUtils;

    /**
     * @deprecated
     */
    get designerCabin(): IPublicApiCommonDesignerCabin;

    /**
     * @experimental unstable API, pay extra caution when trying to use this
     */
    get editorCabin(): IPublicApiCommonEditorCabin;

    get skeletonCabin(): IPublicApiCommonSkeletonCabin;
}
export interface IPublicApiCommonSkeletonCabin {
    /**
     * 编辑器框架 View
     * get Workbench Component
     */
    get Workbench(): Component;
}
export interface IPublicApiCommonDesignerCabin {
}
export interface IPublicApiCommonEditorCabin {
    /**
     * Title 组件
     * @experimental unstable API, pay extra caution when trying to use this
     */
    get Tip(): Component;
    /**
     * Tip 组件
     * @experimental unstable API, pay extra caution when trying to use this
     */
    get Title(): Component;
}
export interface IPublicModelPluginContext {
    /**
     * 对于插件开发者来说，可以在 context 挂载自定义的内容，作为插件内全局上下文使用
     *
     * for plugin developers, costom properties can be add to plugin context
     * from inside plugin for convenience.
     */
    [key: string]: any;
    /**
     * 可通过该对象读取插件初始化配置
     * by using this, init options can be accessed from inside plugin
     */
    preference: IPluginPreferenceMananger;

    get skeleton(): IPublicApiSkeleton;
    get hotkey(): IPublicApiHotkey;
    get setters(): IPublicApiSetters;
    get config(): IPublicModelEngineConfig;
    get material(): IPublicApiMaterial;
    /**
     * this event works globally, can be used between plugins and engine.
     */
    get event(): IPublicApiEvent;
    get project(): IPublicApiProject;
    get common(): IPublicApiCommon;
    get plugins(): IPublicApiPlugins;
    get logger(): IPublicApiLogger;
    /**
     * this event works within current plugin, on an emit locally.
     */
    get pluginEvent(): IPublicApiEvent;
    get canvas(): IPublicApiCanvas;
}
export declare type IPublicTypePluginCreater = (ctx: IPublicModelPluginContext, options: any) => IPublicTypePluginConfig;
export interface IPublicTypePlugin extends IPublicTypePluginCreater {
    pluginName: string;
    meta?: IPublicTypePluginMeta;
}

export interface ILowCodePluginManagerCore {
    register(
        pluginModel: IPublicTypePlugin,
        pluginOptions?: any,
        options?: IPublicTypeCompositeObject,
    ): Promise<void>;
    init(pluginPreference?: Map<string, Record<string, IPublicTypePreferenceValueType>>): Promise<void>;
    get(pluginName: string): ILowCodePluginRuntime | undefined;
    getAll(): ILowCodePluginRuntime[];
    has(pluginName: string): boolean;
    delete(pluginName: string): any;
    setDisabled(pluginName: string, flag: boolean): void;
    dispose(): void;
}
interface ILowCodePluginManagerPluginAccessor {
    [pluginName: string]: ILowCodePluginRuntime | any;
}
export type PluginOptionsType = string | number | boolean | object;

export interface IPublicTypePluginRegisterOptions {
    /**
     * Will enable plugin registered with auto-initialization immediately
     * other than plugin-manager init all plugins at certain time.
     * It is helpful when plugin register is later than plugin-manager initialization.
     */
    autoInit?: boolean;
    /**
     * allow overriding existing plugin with same name when override === true
     */
    override?: boolean;
}
export interface IPublicModelPluginInstance {

    /**
     * 是否 disable
     * current plugin instance is disabled or not
     */
    disabled: boolean;

    /**
     * 插件名称
     * plugin name
     */
    get pluginName(): string;

    /**
     * 依赖信息，依赖的其他插件
     * depenency info
     */
    get dep(): string[];

    /**
     * 插件配置元数据
     * meta info of this plugin
     */
    get meta(): IPublicTypePluginMeta;
}

export interface IPublicApiPlugins {
    register(
        pluginModel: IPublicTypePlugin,
        options?: Record<string, PluginOptionsType>,
        registerOptions?: IPublicTypePluginRegisterOptions,
    ): Promise<void>;

    /**
     * 引擎初始化时可以提供全局配置给到各插件，通过这个方法可以获得本插件对应的配置
     * use this to get preference config for this plugin when engine.init() called
     */
    getPluginPreference(
        pluginName: string,
    ): Record<string, IPublicTypePreferenceValueType> | null | undefined;

    /**
     * 获取指定插件
     * get plugin instance by name
     */
    get(pluginName: string): IPublicModelPluginInstance | null;

    /**
     * 获取所有的插件实例
     * get all plugin instances
     */
    getAll(): IPublicModelPluginInstance[];

    /**
     * 判断是否有指定插件
     * check if plugin with certain name exists
     */
    has(pluginName: string): boolean;

    /**
     * 删除指定插件
     * delete plugin instance by name
     */
    delete(pluginName: string): void;
}
export interface IPublicModelScrollTarget {
    get left(): number;
    get top(): number;
    scrollTo(options: { left?: number; top?: number }): void;
    scrollToXY(x: number, y: number): void;
    get scrollHeight(): number;
    get scrollWidth(): number;
}

export interface IPublicTypeScrollable {
    scrollTarget?: IPublicModelScrollTarget | Element;
    bounds?: DOMRect | null;
    scale?: number;
}
export interface IPublicModelScroller {

    scrollTo(options: { left?: number; top?: number }): void;

    cancel(): void;

    scrolling(point: { globalX: number; globalY: number }): void;
}
export interface IPublicTypeLocationData {
    target: IPublicModelNode; // shadowNode | ConditionFlow | ElementNode | RootNode
    detail: IPublicTypeLocationDetail;
    source: string;
    event: IPublicModelLocateEvent;
}

export interface IPublicTypeDragAnyObject {
    type: string;
    [key: string]: any;
}

// eslint-disable-next-line max-len
export type IPublicTypeDragObject = IPublicTypeDragNodeObject | IPublicTypeDragNodeDataObject | IPublicTypeDragAnyObject;

export interface IPublicModelDragon {

    /**
     * 是否正在拖动
     * is dragging or not
     */
    get dragging(): boolean;

    /**
     * 绑定 dragstart 事件
     * bind a callback function which will be called on dragging start
     * @param func
     * @returns
     */
    onDragstart(func: (e: IPublicModelLocateEvent) => any): () => void;

    /**
     * 绑定 drag 事件
     * bind a callback function which will be called on dragging
     * @param func
     * @returns
     */
    onDrag(func: (e: IPublicModelLocateEvent) => any): () => void;

    /**
     * 绑定 dragend 事件
     * bind a callback function which will be called on dragging end
     * @param func
     * @returns
     */
    onDragend(func: (o: { dragObject: IPublicModelDragObject; copy?: boolean }) => any): () => void;

    /**
     * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
     * set a html element as shell to dragon as monitoring target, and
     * set boost function which is used to transform a MouseEvent to type
     * IPublicTypeDragNodeDataObject.
     * @param shell 拖拽监听的区域
     * @param boost 拖拽转换函数
     */
    from(shell: Element, boost: (e: MouseEvent) => IPublicTypeDragNodeDataObject | null): any;

    /**
     * 发射拖拽对象
     * boost your dragObject for dragging(flying)
     *
     * @param dragObject 拖拽对象
     * @param boostEvent 拖拽初始时事件
     */
    boost(dragObject: IPublicTypeDragObject, boostEvent: MouseEvent | DragEvent, fromRglNode?: Node | IPublicModelNode): void;

    /**
     * 添加投放感应区
     * add sensor area
     */
    addSensor(sensor: any): void;

    /**
     * 移除投放感应
     * remove sensor area
     */
    removeSensor(sensor: any): void;
}
export type IPublicTypeComponentInstance = Element | Component<any> | object;
export interface IPublicTypeActiveTarget {
    node: IPublicModelNode;
    detail?: IPublicTypeLocationDetail;
    instance?: IPublicTypeComponentInstance;
}

export interface IPublicModelActiveTracker {
    onChange(fn: (target: IPublicTypeActiveTarget) => void): () => void;

    track(node: IPublicModelNode): void;
}

/**
 * @since v1.1.0
 */
export interface IPublicApiCanvas {

    /**
     * 创一个滚动控制器 Scroller，赋予一个视图滚动的基本能力，
     * a Scroller is a controller that gives a view (IPublicTypeScrollable) the ability scrolling
     * to some cordination by api scrollTo.
     *
     * when a scroller is inited, will need to pass is a scrollable, which has a scrollTarget.
     * and when scrollTo(options: { left?: number; top?: number }) is called, scroller will
     * move scrollTarget`s top-left corner to (options.left, options.top) that passed in.
     * @since v1.1.0
     */
    createScroller(scrollable: IPublicTypeScrollable): IPublicModelScroller;

    /**
     * 创建一个 ScrollTarget，与 Scroller 一起发挥作用，详见 createScroller 中的描述
     * this works with Scroller, refer to createScroller`s description
     * @since v1.1.0
     */
    createScrollTarget(shell: HTMLDivElement): IPublicModelScrollTarget;

    /**
     * 创建一个文档插入位置对象，该对象用来描述一个即将插入的节点在文档中的位置
     * create a drop location for document, drop location describes a location in document
     * @since v1.1.0
     */
    createLocation(locationData: IPublicTypeLocationData): IPublicModelDropLocation;

    /**
     * 获取拖拽操作对象的实例
     * get dragon instance, you can use this to obtain draging related abilities and lifecycle hooks
     * @since v1.1.0
     */
    get dragon(): IPublicModelDragon | null;

    /**
     * 获取活动追踪器实例
     * get activeTracker instance, which is a singleton running in engine.
     * it tracks document`s current focusing node/node[], and notify it`s subscribers that when
     * focusing node/node[] changed.
     * @since v1.1.0
     */
    get activeTracker(): IPublicModelActiveTracker | null;

    /**
     * 是否处于 LiveEditing 状态
     * check if canvas is in liveEditing state
     * @since v1.1.0
     */
    get isInLiveEditing(): boolean;

    /**
     * 获取全局剪贴板实例
     * get clipboard instance
     *
     * @since v1.1.0
     */
    get clipboard(): IPublicModelClipboard;
}

export interface IPublicModelClipboard {

    /**
     * 给剪贴板赋值
     * set data to clipboard
     *
     * @param {*} data
     * @since v1.1.0
     */
    setData(data: any): void;

    /**
     * 设置剪贴板数据设置的回调
     * set callback for clipboard provide paste data
     *
     * @param {KeyboardEvent} keyboardEvent
     * @param {(data: any, clipboardEvent: ClipboardEvent) => void} cb
     * @since v1.1.0
     */
    waitPasteData(
        keyboardEvent: KeyboardEvent,
        cb: (data: any, clipboardEvent: ClipboardEvent) => void,
    ): void;
}
export interface ILowCodePluginContextPrivate {
    set skeleton(skeleton: IPublicApiSkeleton);
}
export interface IPublicModelResource {
    get title(): string | undefined;

    get icon(): ReactElement | undefined;

    get options(): Object;

    get name(): string | undefined;

    get type(): string | undefined;

    get category(): string | undefined;
}
export interface IPublicModelWindow {

    /** 窗口 id */
    id: string;

    /** 窗口标题 */
    title?: string;

    /** 窗口 icon */
    icon?: ReactElement;

    /** 窗口资源类型 */
    resource?: IPublicModelResource;

    /** 当前窗口导入 schema */
    importSchema(schema: IPublicTypeNodeSchema): void;

    /** 修改当前窗口视图类型 */
    changeViewType(viewName: string): void;

    /** 调用当前窗口视图保存钩子 */
    save(): Promise<any>;

    /** 窗口视图变更事件 */
    onChangeViewType(fn: (viewName: string) => void): IPublicTypeDisposable;
}
export interface IPublicResourceData {
    resourceName: string;
    title: string;
    category?: string;
    viewType?: string;
    icon?: ReactElement;
    options: {
        [key: string]: any;
    };
    children?: IPublicResourceData[];
}
export type IPublicResourceList = IPublicResourceData[];
export interface IPublicEditorViewConfig {

    /** 视图初始化钩子 */
    init?: () => Promise<void>;

    /** 资源保存时，会调用视图的钩子 */
    save?: () => Promise<void>;

    /** viewType 类型为 'webview' 时渲染的地址 */
    url?: () => Promise<string>;
}
export interface IPublicTypeEditorView {

    /** 资源名字 */
    viewName: string;

    /** 资源类型 */
    viewType?: 'editor' | 'webview';

    (ctx: any, options: any): IPublicEditorViewConfig;
}
export interface IPublicTypeEditorView {

    /** 资源名字 */
    viewName: string;

    /** 资源类型 */
    viewType?: 'editor' | 'webview';

    (ctx: any, options: any): IPublicEditorViewConfig;
}
export interface IPublicResourceTypeConfig {

    /** 资源描述 */
    description?: string;

    /** 资源 icon 标识 */
    icon?: React.ReactElement;

    /** 默认视图类型 */
    defaultViewType: string;

    /** 资源视图 */
    editorViews: IPublicTypeEditorView[];

    init?: () => void;

    /** save 钩子 */
    save?: (schema: {
        [viewName: string]: any;
    }) => Promise<void>;

    /** import 钩子 */
    import?: (schema: any) => Promise<{
        [viewName: string]: any;
    }>;

    /** 默认标题 */
    defaultTitle?: string;

    /** resourceType 类型为 'webview' 时渲染的地址 */
    url?: () => Promise<string>;
}
export interface IPublicTypeResourceType {
    resourceName: string;

    resourceType: 'editor' | 'webview';

    (ctx: IPublicModelPluginContext, options: Object): IPublicResourceTypeConfig;
}
export interface IPublicApiWorkspace {

    /** 是否启用 workspace 模式 */
    isActive: boolean;

    /** 当前设计器窗口 */
    window: IPublicModelWindow;

    plugins: IPublicApiPlugins;

    /** 当前设计器的编辑窗口 */
    windows: IPublicModelWindow[];

    /** 获取资源树列表 */
    get resourceList(): IPublicModelResource[];

    /** 设置资源树列表 */
    setResourceList(resourceList: IPublicResourceList): void;

    /** 资源树列表更新事件 */
    onResourceListChange(fn: (resourceList: IPublicResourceList) => void): IPublicTypeDisposable;

    /** 注册资源 */
    registerResourceType(resourceTypeModel: IPublicTypeResourceType): void;

    /** 打开视图窗口 */
    openEditorWindow(resourceName: string, title: string, extra: Object, viewName?: string): void;

    /** 通过视图 id 打开窗口 */
    openEditorWindowById(id: string): void;

    /** 移除视图窗口 */
    removeEditorWindow(resourceName: string, title: string): void;

    /** 通过视图 id 移除窗口 */
    removeEditorWindowById(id: string): void;

    /** 窗口新增/删除的事件 */
    onChangeWindows(fn: () => void): IPublicTypeDisposable;

    /** active 窗口变更事件 */
    onChangeActiveWindow(fn: () => void): IPublicTypeDisposable;
}
export interface IPluginContextOptions {
    pluginName: string;
    meta?: IPublicTypePluginMeta;
}
export interface ILowCodePluginContextApiAssembler {
    assembleApis(
        context: ILowCodePluginContextPrivate,
        pluginName: string,
        meta: IPublicTypePluginMeta,
    ): void;
}
const levels: Record<string, number> = {
    debug: -1,
    log: 0,
    info: 0,
    warn: 1,
    error: 2,
};
export interface IEventBus extends IPublicApiEvent {
    removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
    addListener(event: string | symbol, listener: (...args: any[]) => void): any;
    setMaxListeners(n: number): any;
    removeAllListeners(event?: string | symbol): any;
}
const shouldOutput = (
    logLevel: string,
    targetLevel: string = 'warn',
    bizName: string,
    targetBizName: string,
): boolean => {
    const isLevelFit = (levels as any)[targetLevel] <= (levels as any)[logLevel];
    const isBizNameFit = targetBizName === '*' || bizName.indexOf(targetBizName) > -1;
    return isLevelFit && isBizNameFit;
};
export type Level = 'debug' | 'log' | 'info' | 'warn' | 'error';
interface Options {
    level: Level;
    bizName: string;
}
const defaultOptions: Options = {
    level: 'warn',
    bizName: '*',
};
const parseLogConf = (logConf: string, options: Options): { level: string; bizName: string } => {
    if (!logConf) {
        return {
            level: options.level,
            bizName: options.bizName,
        };
    }
    if (logConf.indexOf(':') > -1) {
        const pair = logConf.split(':');
        return {
            level: pair[0],
            bizName: pair[1] || '*',
        };
    }
    return {
        level: logConf,
        bizName: '*',
    };
};
const outputFuntion: Record<string, any> = {
    debug: console.log,
    log: console.log,
    info: console.log,
    warn: console.warn,
    error: console.error,
};
const bizNameColors = [
    '#daa569',
    '#00ffff',
    '#385e0f',
    '#7fffd4',
    '#00c957',
    '#b0e0e6',
    '#4169e1',
    '#6a5acd',
    '#87ceeb',
    '#ffff00',
    '#e3cf57',
    '#ff9912',
    '#eb8e55',
    '#ffe384',
    '#40e0d0',
    '#a39480',
    '#d2691e',
    '#ff7d40',
    '#f0e68c',
    '#bc8f8f',
    '#c76114',
    '#734a12',
    '#5e2612',
    '#0000ff',
    '#3d59ab',
    '#1e90ff',
    '#03a89e',
    '#33a1c9',
    '#a020f0',
    '#a066d3',
    '#da70d6',
    '#dda0dd',
    '#688e23',
    '#2e8b57',
];
const bizNameColorConfig: Record<string, string> = {};
const getColor = (bizName: string) => {
    if (!bizNameColorConfig[bizName]) {
        const color = bizNameColors[Object.keys(bizNameColorConfig).length % bizNameColors.length];
        bizNameColorConfig[bizName] = color;
    }
    return bizNameColorConfig[bizName];
};
const bodyColors: Record<string, string> = {
    debug: '#666666',
    log: '#bbbbbb',
    info: '#ffffff',
    warn: '#bbbbbb',
    error: '#bbbbbb',
};
const levelMarks: Record<string, string> = {
    debug: 'debug',
    log: 'log',
    info: 'info',
    warn: 'warn',
    error: 'error',
};
export function isObject(value: any): value is Record<string, unknown> {
    return value !== null && typeof value === 'object';
}
const getLogArgs = (args: any, bizName: string, logLevel: string) => {
    const color = getColor(bizName);
    const bodyColor = bodyColors[logLevel];

    const argsArray = args[0];
    let prefix = `%c[${bizName}]%c[${levelMarks[logLevel]}]:`;
    argsArray.forEach((arg: any) => {
        if (isObject(arg)) {
            prefix += '%o';
        } else {
            prefix += '%s';
        }
    });
    let processedArgs = [prefix, `color: ${color}`, `color: ${bodyColor}`];
    processedArgs = processedArgs.concat(argsArray);
    return processedArgs;
};
const output = (logLevel: string, bizName: string) => {
    return (...args: any[]) => {
        return outputFuntion[logLevel].apply(console, getLogArgs(args, bizName, logLevel));
    };
};

class Logger {
    bizName: string;
    targetBizName: string;
    targetLevel: string;
    constructor(options: Options) {
        options = { ...defaultOptions, ...options };
        const _location = location || {} as any;
        // __logConf__ 格式为 logLevel[:bizName], bizName is used as: targetBizName like '%bizName%'
        //   1. __logConf__=log  or __logConf__=warn,  etc.
        //   2. __logConf__=log:*  or __logConf__=warn:*,  etc.
        //   2. __logConf__=log:bizName  or __logConf__=warn:partOfBizName,  etc.
        const logConf = (((/__(?:logConf|logLevel)__=([^#/&]*)/.exec(_location.href)) || [])[1]);
        const targetOptions = parseLogConf(logConf, options);
        this.bizName = options.bizName;
        this.targetBizName = targetOptions.bizName;
        this.targetLevel = targetOptions.level;
    }
    debug(...args: any[]): void {
        if (!shouldOutput('debug', this.targetLevel, this.bizName, this.targetBizName)) {
            return;
        }
        return output('debug', this.bizName)(args);
    }
    log(...args: any[]): void {
        if (!shouldOutput('log', this.targetLevel, this.bizName, this.targetBizName)) {
            return;
        }
        return output('log', this.bizName)(args);
    }
    info(...args: any[]): void {
        if (!shouldOutput('info', this.targetLevel, this.bizName, this.targetBizName)) {
            return;
        }
        return output('info', this.bizName)(args);
    }
    warn(...args: any[]): void {
        if (!shouldOutput('warn', this.targetLevel, this.bizName, this.targetBizName)) {
            return;
        }
        return output('warn', this.bizName)(args);
    }
    error(...args: any[]): void {
        if (!shouldOutput('error', this.targetLevel, this.bizName, this.targetBizName)) {
            return;
        }
        return output('error', this.bizName)(args);
    }
}
const moduleLogger = new Logger({ level: 'warn', bizName: 'module-event-bus' });
const logger = new Logger({ level: 'warn', bizName: 'event-bus' });
export class EventBus implements IEventBus {
    private readonly eventEmitter: EventEmitter;
    private readonly name?: string;

    /**
     * 内核触发的事件名
     */
    readonly names = [];

    constructor(emitter: EventEmitter, name?: string) {
        this.eventEmitter = emitter;
        this.name = name;
    }

    private getMsgPrefix(type: string): string {
        if (this.name && this.name.length > 0) {
            return `[${this.name}][event-${type}]`;
        } else {
            return `[*][event-${type}]`;
        }
    }

    private getLogger(): Logger {
        if (this.name && this.name.length > 0) {
            return moduleLogger;
        } else {
            return logger;
        }
    }

    /**
     * 监听事件
     * @param event 事件名称
     * @param listener 事件回调
     */
    on(event: string, listener: (...args: any[]) => void): () => void {
        this.eventEmitter.on(event, listener);
        this.getLogger().debug(`${this.getMsgPrefix('on')} ${event}`);
        return () => {
            this.off(event, listener);
        };
    }

    /**
     * 取消监听事件
     * @param event 事件名称
     * @param listener 事件回调
     */
    off(event: string, listener: (...args: any[]) => void) {
        this.eventEmitter.off(event, listener);
        this.getLogger().debug(`${this.getMsgPrefix('off')} ${event}`);
    }

    /**
     * 触发事件
     * @param event 事件名称
     * @param args 事件参数
     * @returns
     */
    emit(event: string, ...args: any[]) {
        this.eventEmitter.emit(event, ...args);
        this.getLogger().debug(`${this.getMsgPrefix('emit')} name: ${event}, args: `, ...args);
    }

    removeListener(event: string | symbol, listener: (...args: any[]) => void): any {
        return this.eventEmitter.removeListener(event, listener);
    }

    addListener(event: string | symbol, listener: (...args: any[]) => void): any {
        return this.eventEmitter.addListener(event, listener);
    }

    setMaxListeners(n: number): any {
        return this.eventEmitter.setMaxListeners(n);
    }
    removeAllListeners(event?: string | symbol): any {
        return this.eventEmitter.removeAllListeners(event);
    }
}
export const createModuleEventBus = (moduleName: string, maxListeners?: number): IEventBus => {
    const emitter = new EventEmitter();
    if (maxListeners) {
        emitter.setMaxListeners(maxListeners);
    }
    return new EventBus(emitter, moduleName);
};
export interface RuntimeOptionsConfig {
    uri: string;
    api?: string;
    params?: Record<string, unknown>;
    method?: string;
    isCors?: boolean;
    timeout?: number;
    headers?: Record<string, unknown>;
    [option: string]: unknown;
}
export interface IDataSourceRuntimeContext<TState extends Record<string, unknown> = Record<string, unknown>> {
    /** 当前数据源的内容 */
    state: TState;
    /** 设置状态(浅合并) */
    setState(state: Partial<TState>): void;
}
export type RequestHandler<T = unknown> = (options: RuntimeOptionsConfig, context?: IDataSourceRuntimeContext) => Promise<T>;

export type RequestHandlersMap<T = unknown> = Record<string, RequestHandler<T>>;
export interface IPublicTypeEngineOptions {
    /**
     * 是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示
     * when this is true, node that configured as conditional not renderring
     * will not display in canvas.
     * @default false
     */
    enableCondition?: boolean;

    /**
     * TODO: designMode 无法映射到文档渲染模块
     *
     * 设计模式，live 模式将会实时展示变量值，默认值：'design'
     *
     * @default 'design'
     * @experimental
     */
    designMode?: 'design' | 'live';

    /**
     * 设备类型，默认值：'default'
     * @default 'default'
     */
    device?: 'default' | 'mobile' | string;

    /**
     * 指定初始化的 deviceClassName，挂载到画布的顶层节点上
     */
    deviceClassName?: string;

    /**
     * 语言，默认值：'zh-CN'
     * @default 'zh-CN'
     */
    locale?: string;

    /**
     * 渲染器类型，默认值：'react'
     */
    renderEnv?: 'react' | 'rax' | string;

    /**
     * 设备类型映射器，处理设计器与渲染器中 device 的映射
     */
    deviceMapper?: {
        transform: (originalDevice: string) => string;
    };

    /**
     * 开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项
     * enable strict plugin mode, default value: false
     * under strict mode, customed engineOption is not accepted.
     */
    enableStrictPluginMode?: boolean;

    /**
     * 开启拖拽组件时，即将被放入的容器是否有视觉反馈，默认值：false
     */
    enableReactiveContainer?: boolean;

    /**
     * 关闭画布自动渲染，在资产包多重异步加载的场景有效，默认值：false
     */
    disableAutoRender?: boolean;

    /**
     * 关闭拖拽组件时的虚线响应，性能考虑，默认值：false
     */
    disableDetecting?: boolean;

    /**
     * 定制画布中点击被忽略的 selectors，默认值：undefined
     */
    customizeIgnoreSelectors?: (defaultIgnoreSelectors: string[], e: MouseEvent) => string[];

    /**
     * 禁止默认的设置面板，默认值：false
     */
    disableDefaultSettingPanel?: boolean;

    /**
     * 禁止默认的设置器，默认值：false
     */
    disableDefaultSetters?: boolean;

    /**
     * 打开画布的锁定操作，默认值：false
     */
    enableCanvasLock?: boolean;

    /**
     * 容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效，默认值为：false
     */
    enableLockedNodeSetting?: boolean;

    /**
     * 当选中节点切换时，是否停留在相同的设置 tab 上，默认值：false
     */
    stayOnTheSameSettingTab?: boolean;

    /**
     * 是否在只有一个 item 的时候隐藏设置 tabs，默认值：false
     */
    hideSettingsTabsWhenOnlyOneItem?: boolean;

    /**
     * 自定义 loading 组件
     */
    loadingComponent?: ComponentType;

    /**
     * 设置所有属性支持变量配置，默认值：false
     */
    supportVariableGlobally?: boolean;

    /**
     * 设置 simulator 相关的 url，默认值：undefined
     */
    simulatorUrl?: string[];

    /**
     * Vision-polyfill settings
     * @deprecated this exists for some legacy reasons
     */
    visionSettings?: {
        // 是否禁用降级 reducer，默认值：false
        disableCompatibleReducer?: boolean;
        // 是否开启在 render 阶段开启 filter reducer，默认值：false
        enableFilterReducerInRenderStage?: boolean;
    };

    /**
     * 与 react-renderer 的 appHelper 一致，https://lowcode-engine.cn/site/docs/guide/expand/runtime/renderer#apphelper
     */
    appHelper?: {
        /** 全局公共函数 */
        utils?: Record<string, any>;
        /** 全局常量 */
        constants?: Record<string, any>;
    };

    /**
     * 数据源引擎的请求处理器映射
     */
    requestHandlersMap?: RequestHandlersMap;

    /**
     * @default true
     * JSExpression 是否只支持使用 this 来访问上下文变量，假如需要兼容原来的 'state.xxx'，则设置为 false
     */
    thisRequiredInJSE?: boolean;

    /**
     * @default false
     * 当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件
     */
    enableStrictNotFoundMode?: boolean;

    /**
     * 配置指定节点为根组件
     */
    focusNodeSelector?: (rootNode: Node) => Node;

    /**
     * 开启应用级设计模式
     */
    enableWorkspaceMode?: boolean;
}
export interface IEngineConfigPrivate {
    /**
     * if engineOptions.strictPluginMode === true, only accept propertied predefined in EngineOptions.
     *
     * @param {IPublicTypeEngineOptions} engineOptions
     */
    setEngineOptions(engineOptions: IPublicTypeEngineOptions): void;

    notifyGot(key: string): void;

    setWait(key: string, resolve: (data: any) => void, once?: boolean): void;

    delWait(key: string, fn: any): void;
}
const STORAGE_KEY_PREFIX = 'ale';
/**
* used to store user preferences, such as pinned status of a pannel.
* save to local storage.
*/
export class Preference implements IPublicModelPreference {
    getStorageKey(key: string, module?: string): string {
        const moduleKey = module || '__inner__';
        return `${STORAGE_KEY_PREFIX}_${moduleKey}.${key}`;
    }

    set(key: string, value: any, module?: string): void {
        if (!key || typeof key !== 'string' || key.length === 0) {
            logger.error('Invalid key when setting preference', key);
            return;
        }
        const storageKey = this.getStorageKey(key, module);
        logger.debug('storageKey:', storageKey, 'set with value:', value);
        store.set(storageKey, value);
    }

    get(key: string, module: string): any {
        if (!key || typeof key !== 'string' || key.length === 0) {
            logger.error('Invalid key when getting from preference', key);
            return;
        }
        const storageKey = this.getStorageKey(key, module);
        const result = store.get(storageKey);
        logger.debug('storageKey:', storageKey, 'get with result:', result);
        return result;
    }

    /**
     * check if local storage contain certain key
     *
     * @param {string} key
     * @param {string} module
     */
    contains(key: string, module: string): boolean {
        if (!key || typeof key !== 'string' || key.length === 0) {
            logger.error('Invalid key when getting from preference', key);
            return false;
        }
        const storageKey = this.getStorageKey(key, module);
        const result = store.get(storageKey);

        return !(result === undefined || result === null);
    }
}
// this default behavior will be different later
const STRICT_PLUGIN_MODE_DEFAULT = true;
// used in strict mode, when only options in this VALID_ENGINE_OPTIONS can be accepted
// type and description are only used for developer`s assistance, won`t affect runtime
const VALID_ENGINE_OPTIONS = {
    enableCondition: {
        type: 'boolean',
        description: '是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示',
    },
    designMode: {
        type: 'string',
        enum: ['design', 'live'],
        default: 'design',
        description: '设计模式，live 模式将会实时展示变量值',
    },
    device: {
        type: 'string',
        enum: ['default', 'mobile', 'any string value'],
        default: 'default',
        description: '设备类型',
    },
    deviceClassName: {
        type: 'string',
        default: undefined,
        description: '指定初始化的 deviceClassName，挂载到画布的顶层节点上',
    },
    locale: {
        type: 'string',
        default: 'zh-CN',
        description: '语言',
    },
    renderEnv: {
        type: 'string',
        enum: ['react', 'rax', 'any string value'],
        default: 'react',
        description: '渲染器类型',
    },
    deviceMapper: {
        type: 'object',
        description: '设备类型映射器，处理设计器与渲染器中 device 的映射',
    },
    enableStrictPluginMode: {
        type: 'boolean',
        default: STRICT_PLUGIN_MODE_DEFAULT,
        description: '开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项',
    },
    enableReactiveContainer: {
        type: 'boolean',
        default: false,
        description: '开启拖拽组件时，即将被放入的容器是否有视觉反馈',
    },
    disableAutoRender: {
        type: 'boolean',
        default: false,
        description: '关闭画布自动渲染，在资产包多重异步加载的场景有效',
    },
    disableDetecting: {
        type: 'boolean',
        default: false,
        description: '关闭拖拽组件时的虚线响应，性能考虑',
    },
    customizeIgnoreSelectors: {
        type: 'function',
        default: undefined,
        description: '定制画布中点击被忽略的 selectors, eg. (defaultIgnoreSelectors: string[], e: MouseEvent) => string[]',
    },
    disableDefaultSettingPanel: {
        type: 'boolean',
        default: false,
        description: '禁止默认的设置面板',
    },
    disableDefaultSetters: {
        type: 'boolean',
        default: false,
        description: '禁止默认的设置器',
    },
    enableCanvasLock: {
        type: 'boolean',
        default: false,
        description: '打开画布的锁定操作',
    },
    enableLockedNodeSetting: {
        type: 'boolean',
        default: false,
        description: '容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效',
    },
    stayOnTheSameSettingTab: {
        type: 'boolean',
        default: false,
        description: '当选中节点切换时，是否停留在相同的设置 tab 上',
    },
    hideSettingsTabsWhenOnlyOneItem: {
        type: 'boolean',
        description: '是否在只有一个 item 的时候隐藏设置 tabs',
    },
    loadingComponent: {
        type: 'ComponentType',
        default: undefined,
        description: '自定义 loading 组件',
    },
    supportVariableGlobally: {
        type: 'boolean',
        default: false,
        description: '设置所有属性支持变量配置',
    },
    visionSettings: {
        type: 'object',
        description: 'Vision-polyfill settings',
    },
    simulatorUrl: {
        type: 'array',
        description: '自定义 simulatorUrl 的地址',
    },
    /**
     * 与 react-renderer 的 appHelper 一致，https://lowcode-engine.cn/site/docs/guide/expand/runtime/renderer#apphelper
     */
    appHelper: {
        type: 'object',
        description: '定义 utils 和 constants 等对象',
    },
    requestHandlersMap: {
        type: 'object',
        description: '数据源引擎的请求处理器映射',
    },
    thisRequiredInJSE: {
        type: 'boolean',
        description: 'JSExpression 是否只支持使用 this 来访问上下文变量',
    },
    enableStrictNotFoundMode: {
        type: 'boolean',
        description: '当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件',
    },
    focusNodeSelector: {
        type: 'function',
        description: '配置指定节点为根组件',
    },
};
export class EngineConfig implements IPublicModelEngineConfig, IEngineConfigPrivate {
    private config: { [key: string]: any } = {};

    private waits = new Map<
        string,
        Array<{
            once?: boolean;
            resolve: (data: any) => void;
        }>
    >();

    /**
     * used to store preferences
     *
     */
    readonly preference: IPublicModelPreference;

    constructor(config?: { [key: string]: any }) {
        this.config = config || {};
        this.preference = new Preference();
    }

    /**
     * 判断指定 key 是否有值
     * @param key
     */
    has(key: string): boolean {
        return this.config[key] !== undefined;
    }

    /**
     * 获取指定 key 的值
     * @param key
     * @param defaultValue
     */
    get(key: string, defaultValue?: any): any {
        return lodashGet(this.config, key, defaultValue);
    }

    /**
     * 设置指定 key 的值
     * @param key
     * @param value
     */
    set(key: string, value: any) {
        this.config[key] = value;
        this.notifyGot(key);
    }

    /**
     * 批量设值，set 的对象版本
     * @param config
     */
    setConfig(config: { [key: string]: any }) {
        if (config) {
            Object.keys(config).forEach((key) => {
                this.set(key, config[key]);
            });
        }
    }

    /**
     * if engineOptions.strictPluginMode === true, only accept propertied predefined in EngineOptions.
     *
     * @param {IPublicTypeEngineOptions} engineOptions
     */
    setEngineOptions(engineOptions: IPublicTypeEngineOptions) {
        if (!engineOptions || !isPlainObject(engineOptions)) {
            return;
        }
        const strictMode = getStrictModeValue(engineOptions, STRICT_PLUGIN_MODE_DEFAULT) === true;
        if (strictMode) {
            const isValidKey = (key: string) => {
                const result = (VALID_ENGINE_OPTIONS as any)[key];
                return !(result === undefined || result === null);
            };
            Object.keys(engineOptions).forEach((key) => {
                if (isValidKey(key)) {
                    this.set(key, (engineOptions as any)[key]);
                } else {
                    logger.warn(`failed to config ${key} to engineConfig, only predefined options can be set under strict mode, predefined options: `, VALID_ENGINE_OPTIONS);
                }
            });
        } else {
            this.setConfig(engineOptions as any);
        }
    }

    /**
     * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
     *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
     * @param key
     * @returns
     */
    onceGot(key: string): Promise<any> {
        const val = this.config[key];
        if (val !== undefined) {
            return Promise.resolve(val);
        }
        return new Promise((resolve) => {
            this.setWait(key, resolve, true);
        });
    }

    /**
     * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
     * @param key
     * @param fn
     * @returns
     */
    onGot(key: string, fn: (data: any) => void): () => void {
        const val = this.config?.[key];
        if (val !== undefined) {
            fn(val);
            return () => { };
        } else {
            this.setWait(key, fn);
            return () => {
                this.delWait(key, fn);
            };
        }
    }

    notifyGot(key: string): void {
        let waits = this.waits.get(key);
        if (!waits) {
            return;
        }
        waits = waits.slice().reverse();
        let i = waits.length;
        while (i--) {
            waits[i].resolve(this.get(key));
            if (waits[i].once) {
                waits.splice(i, 1);
            }
        }
        if (waits.length > 0) {
            this.waits.set(key, waits);
        } else {
            this.waits.delete(key);
        }
    }

    setWait(key: string, resolve: (data: any) => void, once?: boolean) {
        const waits = this.waits.get(key);
        if (waits) {
            waits.push({ resolve, once });
        } else {
            this.waits.set(key, [{ resolve, once }]);
        }
    }

    delWait(key: string, fn: any) {
        const waits = this.waits.get(key);
        if (!waits) {
            return;
        }
        let i = waits.length;
        while (i--) {
            if (waits[i].resolve === fn) {
                waits.splice(i, 1);
            }
        }
        if (waits.length < 1) {
            this.waits.delete(key);
        }
    }

    getPreference(): IPublicModelPreference {
        return this.preference;
    }
}



const getStrictModeValue = (engineOptions: IPublicTypeEngineOptions, defaultValue: boolean): boolean => {
    if (!engineOptions || !isPlainObject(engineOptions)) {
        return defaultValue;
    }
    if (engineOptions.enableStrictPluginMode === undefined
        || engineOptions.enableStrictPluginMode === null) {
        return defaultValue;
    }
    return engineOptions.enableStrictPluginMode;
};

export function isPlainObject(value: any): value is any {
    if (!isObject(value)) {
        return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null;
}

export const engineConfig = new EngineConfig();
export function isValidPreferenceKey(
    key: string,
    preferenceDeclaration: IPublicTypePluginDeclaration,
): boolean {
    if (!preferenceDeclaration || !Array.isArray(preferenceDeclaration.properties)) {
        return false;
    }
    return preferenceDeclaration.properties.some((prop) => {
        return prop.key === key;
    });
}

export default class LowCodePluginContext implements IPublicModelPluginContext, ILowCodePluginContextPrivate {
    hotkey: IPublicApiHotkey;
    project: IPublicApiProject;
    skeleton: IPublicApiSkeleton;
    setters: IPublicApiSetters;
    material: IPublicApiMaterial;
    event: IPublicApiEvent;
    config: IPublicModelEngineConfig;
    common: IPublicApiCommon;
    logger: IPublicApiLogger;
    plugins: IPublicApiPlugins;
    preference: IPluginPreferenceMananger;
    pluginEvent: IPublicApiEvent;
    canvas: IPublicApiCanvas;
    set workspace(workspace: IPublicApiWorkspace) {
    }
    constructor(
        options: IPluginContextOptions,
        contextApiAssembler: ILowCodePluginContextApiAssembler,
    ) {
        const { pluginName = 'anonymous', meta = {} } = options;
        contextApiAssembler.assembleApis(this, pluginName, meta);
    }
}

export type ILowCodePluginManager = ILowCodePluginManagerCore & ILowCodePluginManagerPluginAccessor;
export type PluginPreference = Map<string, Record<string, IPublicTypePreferenceValueType>>;
export function isLowCodeRegisterOptions(opts: any): opts is IPublicTypePluginRegisterOptions {
    return opts && ('autoInit' in opts || 'override' in opts);
}
export function filterValidOptions(
    opts: any,
    preferenceDeclaration: IPublicTypePluginDeclaration,
) {
    if (!opts || !isPlainObject(opts)) return opts;
    const filteredOpts = {} as any;
    Object.keys(opts).forEach((key) => {
        if (isValidPreferenceKey(key, preferenceDeclaration)) {
            const v = opts[key];
            if (v !== undefined && v !== null) {
                filteredOpts[key] = v;
            }
        }
    });
    return filteredOpts;
}
export function invariant(check: any, message: string, thing?: any) {
    if (!check) {
        throw new Error(`[designer] Invariant failed: ${message}${thing ? ` in '${thing}'` : ''}`);
    }
}
export function getLogger(config: { level: Level; bizName: string }): Logger {
    return new Logger(config);
}
export class LowCodePluginRuntime implements ILowCodePluginRuntime {
    config: IPublicTypePluginConfig;

    private manager: ILowCodePluginManager;

    private _inited: boolean;

    private pluginName: string;

    meta: IPublicTypePluginMeta;

    constructor(
        pluginName: string,
        manager: ILowCodePluginManager,
        config: IPublicTypePluginConfig,
        meta: IPublicTypePluginMeta,
    ) {
        this.manager = manager;
        this.config = config;
        this.pluginName = pluginName;
        this.meta = meta;
    }
    async init(forceInit?: boolean) {
        if (this._inited && !forceInit) return;
        await this.config.init?.call(undefined);
        this._inited = true;
    }
}
function sequence(tasks: any, names: any, results: any, missing: any, recursive: any, nest: any) {
    names.forEach((name: any) => {
        if (results.indexOf(name) !== -1) {
            return; // de-dup results
        }
        const node = tasks[name];
        if (!node) {
            missing.push(name);
        } else if (nest.indexOf(name) > -1) {
            nest.push(name);
            recursive.push(nest.slice(0));
            nest.pop(name);
        } else if (node.dep.length) {
            nest.push(name);
            sequence(tasks, node.dep, results, missing, recursive, nest); // recurse
            nest.pop(name);
        }
        results.push(name);
    });
}
function sequencify(tasks: any, names: any) {
    let results: any = []; // the final sequence
    const missing: any = []; // missing tasks
    const recursive: any = []; // recursive task dependencies

    sequence(tasks, names, results, missing, recursive, []);

    if (missing.length || recursive.length) {
        results = []; // results are incomplete at best, completely wrong at worst, remove them to avoid confusion
    }

    return {
        sequence: results,
        missingTasks: missing,
        recursiveDependencies: recursive,
    };
}
export class LowCodePluginManager implements ILowCodePluginManager {
    private plugins: ILowCodePluginRuntime[] = [];

    pluginsMap: Map<string, ILowCodePluginRuntime> = new Map();
    pluginContextMap: Map<string, LowCodePluginContext> = new Map();

    private pluginPreference?: PluginPreference = new Map();

    contextApiAssembler: ILowCodePluginContextApiAssembler;

    constructor(contextApiAssembler: ILowCodePluginContextApiAssembler, readonly viewName = 'global') {
        this.contextApiAssembler = contextApiAssembler;
    }

    _getLowCodePluginContext = (options: IPluginContextOptions) => {
        const { pluginName } = options;
        let context = this.pluginContextMap.get(pluginName);
        if (!context) {
            context = new LowCodePluginContext(options, this.contextApiAssembler);
            this.pluginContextMap.set(pluginName, context);
        }
        return context;
    };
    /**
     * register a plugin
     * @param pluginConfigCreator - a creator function which returns the plugin config
     * @param options - the plugin options
     * @param registerOptions - the plugin register options
     */
    async register(
        pluginModel: IPublicTypePlugin,
        options?: any,
        registerOptions?: IPublicTypePluginRegisterOptions,
    ): Promise<void> {
        if (isLowCodeRegisterOptions(options)) {
            registerOptions = options;
            options = {};
        }
        let { pluginName, meta = {} } = pluginModel;
        const ctx = this._getLowCodePluginContext({ pluginName, meta });
        const config = pluginModel(ctx, {});
        // @ts-ignore
        pluginName = pluginName || config.name;
  
        const plugin = new LowCodePluginRuntime(pluginName, this, config, meta);
        if (registerOptions?.autoInit) {
            await plugin.init();
        }
        this.plugins.push(plugin);
        this.pluginsMap.set(pluginName, plugin);
    }

    async init(pluginPreference?: PluginPreference) {
        const pluginNames: string[] = [];
        const pluginObj: { [name: string]: ILowCodePluginRuntime } = {};
        this.pluginPreference = pluginPreference;
        this.plugins.forEach((plugin) => {
            pluginNames.push(plugin.name);
            pluginObj[plugin.name] = plugin;
        });
        // 循环配置得到result
        const { missingTasks, sequence } = sequencify(pluginObj, pluginNames);
        invariant(!missingTasks.length, 'plugin dependency missing', missingTasks);
        for (const pluginName of sequence) {
            try {
                await this.pluginsMap.get(pluginName)!.init();
            } catch (e) /* istanbul ignore next */ {
                logger.error(
                    `Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`,
                );
                logger.error(e);
            }
        }
    }



    getPluginPreference(pluginName: string): Record<string, IPublicTypePreferenceValueType> | null | undefined {
        if (!this.pluginPreference) {
            return null;
        }
        return this.pluginPreference.get(pluginName);
    }

}
