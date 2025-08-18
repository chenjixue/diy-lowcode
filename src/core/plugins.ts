import { ComponentType, ReactElement, ReactNode } from 'react';
import { LowCodePluginManager } from './plugin-manager';

export type IPublicTypePreferenceValueType = string | number | boolean;

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

/**
 * declaration of plugin`s preference
 * when strictPluginMode === true， only declared preference can be obtained from inside plugin.
 */
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
export interface IPluginPreferenceMananger {
    // eslint-disable-next-line max-len
    getPreferenceValue: (
        key: string,
        defaultValue?: IPublicTypePreferenceValueType,
    ) => IPublicTypePreferenceValueType | undefined;
}
/**
* 所有可能的停靠位置
*/
export type IPublicTypeWidgetConfigArea = 'leftArea' | 'left' | 'rightArea' |
    'right' | 'topArea' | 'subTopArea' | 'top' |
    'toolbar' | 'mainArea' | 'main' |
    'center' | 'centerArea' | 'bottomArea' |
    'bottom' | 'leftFixedArea' |
    'leftFloatArea' | 'stages';

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
export interface IPublicTypeDisposable {
    (): void;
}

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
export interface IPublicTypeTipConfig {
    className?: string;
    children?: IPublicTypeI18nData | ReactNode;
    theme?: string;
    direction?: 'top' | 'bottom' | 'left' | 'right';
}
export interface IPublicTypeIconConfig {
    type: string;
    size?: number | 'small' | 'xxs' | 'xs' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl' | 'inherit';
    className?: string;
}

export type TipContent = string | IPublicTypeI18nData | ReactNode | IPublicTypeTipConfig;
export type IPublicTypeIconType = string | ReactElement | ComponentType<any> | IPublicTypeIconConfig;
/**
 * 描述 props 的 setter title
 */
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
export interface IPublicTypeI18nData {
    type: 'i18n';
    intl?: ReactNode;
    [key: string]: any;
}

export type IPublicTypeTitleContent = string | IPublicTypeI18nData | ReactElement | IPublicTypeTitleConfig;
export type IPublicTypeCustomView = ReactElement | ComponentType<any>;
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
    // 标识是否为动态 setter，默认为 true
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
    registerSetter(
        typeOrMaps: string | { [key: string]: IPublicTypeCustomView | IPublicTypeRegisteredSetter },
        setter?: IPublicTypeCustomView | IPublicTypeRegisteredSetter | undefined
    ): void;
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
    setConfig(config: { [key: string]: any }): void;

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

type FilterNotOptional<T> = Pick<
    T,
    Exclude<
        {
            [K in keyof T]: T extends Record<K, T[K]> ? never : K;
        }[keyof T],
        undefined
    >
>;
type FilterOptional<T> = Pick<
    T,
    Exclude<
        {
            [K in keyof T]: T extends Record<K, T[K]> ? K : never;
        }[keyof T],
        undefined
    >
>;
type PartialEither<T, K extends keyof any> = { [P in Exclude<keyof FilterOptional<T>, K>]-?: T[P] } &
    { [P in Exclude<keyof FilterNotOptional<T>, K>]?: T[P] } &
    { [P in Extract<keyof T, K>]?: undefined };
type Object = {
    [name: string]: any;
};
export type EitherOr<O extends Object, L extends string, R extends string> =
    (
        PartialEither<Pick<O, L | R>, L> |
        PartialEither<Pick<O, L | R>, R>
    ) & Omit<O, L | R>;

/**
 * 定义组件大包及 external 资源的信息
 * 应该被编辑器默认加载
 */
export type IPublicTypePackage = EitherOr<{
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
export type IPublicTypeDOMText = string;
export type IPublicTypeNodeData = IPublicTypeNodeSchema | IPublicTypeJSExpression | IPublicTypeDOMText;
export type IPublicTypeJSONArray = IPublicTypeJSONValue[];
export interface IPublicTypeJSONObject {
    [key: string]: IPublicTypeJSONValue;
}
/**
 * JSON 基本类型
 */
export type IPublicTypeJSONValue =
    | boolean
    | string
    | number
    | null
    | undefined
    | IPublicTypeJSONArray
    | IPublicTypeJSONObject;
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
/**
 * 复合类型
 */
export type IPublicTypeCompositeValue = IPublicTypeJSONValue |
    IPublicTypeJSExpression |
    IPublicTypeJSFunction |
    IPublicTypeJSSlot |
    IPublicTypeCompositeArray |
    IPublicTypeCompositeObject;

export interface IPublicTypeCompositeObject {
    [key: string]: IPublicTypeCompositeValue;
}
export type IPublicTypePropsMap = IPublicTypeCompositeObject;
/**
 * 搭建基础协议 - 单个组件树节点描述
 */
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
    } & IPublicTypePropsMap; // | PropsList;

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

    // @todo
    // ------- future support -----
    conditionGroup?: string;
    title?: string;
    ignore?: boolean;
    locked?: boolean;
    hidden?: boolean;
    isTopFixed?: boolean;

    /** @experimental 编辑态内部使用 */
    __ctx?: any;
}
export interface JSFunction {
    type: 'JSFunction';
    /**
     * 表达式字符串
     */
    value: string;
}
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
export type JSONArray = JSONValue[];
export type JSONValue = boolean | string | number | null | undefined | JSONArray | JSONObject;
export interface JSONObject {
    [key: string]: JSONValue;
}
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
        api?: string | JSExpression;
        params?: JSONObject | JSExpression;
        method?: string | JSExpression;
        isCors?: boolean | JSExpression;
        timeout?: number | JSExpression;
        headers?: JSONObject | JSExpression;
        [option: string]: CompositeValue;
    };
    [otherKey: string]: CompositeValue;
}
export type CompositeArray = CompositeValue[];
export interface CompositeObject {
    [key: string]: CompositeValue;
}
export type CompositeValue = JSONValue | JSExpression | JSFunction | CompositeArray | CompositeObject;
/**
 * 数据源对象
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface DataSource {
    list: InterpretDataSourceConfig[];
    dataHandler?: JSFunction;
}

/**
 * 容器结构描述
 */
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
        // @todo 生命周期对象建议改为闭合集合
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
 * 低代码业务组件容器
 * @see https://lowcode-engine.cn/lowcode
 */

export interface IPublicTypeComponentSchema extends IPublicTypeContainerSchema {
    componentName: 'Component';
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
 * 本地物料描述
 */

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
export type IPublicTypeBasicType = 'array' | 'bool' | 'func' | 'number' | 'object' | 'string' | 'node' | 'element' | 'any';
export interface IPublicTypeOneOfType {
    type: 'oneOfType';
    value: IPublicTypePropType[];
    isRequired?: boolean;
}
export interface IPublicTypeRequiredType {
    type: IPublicTypeBasicType;
    isRequired?: boolean;
}
export interface IPublicTypeOneOf {
    type: 'oneOf';
    value: string[];
    isRequired?: boolean;
}
export interface IPublicTypeArrayOf {
    type: 'arrayOf';
    value: IPublicTypePropType;
    isRequired?: boolean;
}
export interface IPublicTypeShape {
    type: 'shape';
    value: IPublicTypePropConfig[];
    isRequired?: boolean;
}
export interface IPublicTypeObjectOf {
    type: 'objectOf';
    value: IPublicTypePropType;
    isRequired?: boolean;
}
export interface IPublicTypeExact {
    type: 'exact';
    value: IPublicTypePropConfig[];
    isRequired?: boolean;
}
export type IPublicTypeComplexType = IPublicTypeOneOf | IPublicTypeOneOfType | IPublicTypeArrayOf | IPublicTypeObjectOf | IPublicTypeShape | IPublicTypeExact;

export type IPublicTypePropType = IPublicTypeBasicType | IPublicTypeRequiredType | IPublicTypeComplexType;

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
export declare type StrictEventEmitter<TEmitterType, TEventRecord, TEmitRecord = TEventRecord, UnneededMethods extends Exclude<OverriddenKeys, keyof TEmitterType> = Exclude<OverriddenKeys, keyof TEmitterType>, NeededMethods extends Exclude<OverriddenKeys, UnneededMethods> = Exclude<OverriddenKeys, UnneededMethods>> = TypeRecord<TEmitterType, TEventRecord, TEmitRecord> & Pick<TEmitterType, Exclude<keyof TEmitterType, OverriddenKeys>> & Pick<OverriddenMethods<TEmitterType, TEventRecord, TEmitRecord>, NeededMethods>;

export interface IPublicModelEditor extends StrictEventEmitter<EventEmitter, GlobalEvent.EventConfig> {
    get: <T = undefined, KeyOrType = any>(keyOrType: KeyOrType, opt?: IPublicTypeEditorGetOptions) => IPublicTypeEditorGetResult<T, KeyOrType> | undefined;
    has: (keyOrType: IPublicTypeEditorValueKey) => boolean;
    set: (key: IPublicTypeEditorValueKey, data: any) => void | Promise<void>;
    onceGot: <T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(keyOrType: KeyOrType) => Promise<IPublicTypeEditorGetResult<T, KeyOrType>>;
    onGot: <T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(keyOrType: KeyOrType, fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void) => () => void;
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
    /**
     * 获取 node 中的第一项
     */
    getNode: () => any;
}
export declare type IPublicTypeDynamicProps = (target: IPublicModelSettingTarget) => Record<string, unknown>;

/**
 * 设置器配置
 */
export interface IPublicTypeSetterConfig {
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
    /**
     * 给 MixedSetter 时切换 Setter 展示用的
     */
    title?: IPublicTypeTitleContent;
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
    isDynamic?: boolean;
}
export declare type IPublicTypeSetterType = IPublicTypeSetterConfig | IPublicTypeSetterConfig[] | string | IPublicTypeCustomView;

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

/**
* 资产包协议
*/

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

export interface IPublicApiMaterial {

    /**
     * 获取组件 map 结构
     * get map of components
     */
    get componentsMap(): { [key: string]: IPublicTypeNpmInfo | ComponentType<any> | object };

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
    registerMetadataTransducer(
        transducer: IPublicTypeMetadataTransducer,
        level?: number,
        id?: string | undefined
    ): void;

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
    modifyBuiltinComponentAction(
        actionName: string,
        handle: (action: IPublicTypeComponentAction) => void,
    ): void;

    /**
     * 监听 assets 变化的事件
     * add callback for assets changed event
     * @param fn
     */
    onChangeAssets(fn: () => void): IPublicTypeDisposable;
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
export interface IPublicTypePluginConfig {
    init(): void;
    destroy?(): void;
    exports?(): any;
}

export type IPublicTypePluginCreater = (ctx: IPublicModelPluginContext, options: any) => IPublicTypePluginConfig;

export interface IPublicTypePlugin extends IPublicTypePluginCreater {
    pluginName: string;
    meta?: IPublicTypePluginMeta;
}

const pluginsSymbol = Symbol('plugins');
const innerPluginsSymbol = Symbol('plugin');
export interface IPublicApiPlugins {
    // register(
    //     pluginModel: IPublicTypePlugin,
    //     options?: Record<string, PluginOptionsType>,
    //     registerOptions?: IPublicTypePluginRegisterOptions,
    // ): Promise<void>;

    /**
     * 引擎初始化时可以提供全局配置给到各插件，通过这个方法可以获得本插件对应的配置
     * use this to get preference config for this plugin when engine.init() called
     */
    // getPluginPreference(
    //     pluginName: string,
    // ): Record<string, IPublicTypePreferenceValueType> | null | undefined;

    /**
     * 获取指定插件
     * get plugin instance by name
     */
    // get(pluginName: string): IPublicModelPluginInstance | null;

    /**
     * 获取所有的插件实例
     * get all plugin instances
     */
    // getAll(): IPublicModelPluginInstance[];

    /**
     * 判断是否有指定插件
     * check if plugin with certain name exists
     */
    // has(pluginName: string): boolean;

    /**
     * 删除指定插件
     * delete plugin instance by name
     */
    // delete(pluginName: string): void;
}
export class Plugins implements IPublicApiPlugins {
    private readonly [innerPluginsSymbol]: LowCodePluginManager;
    get [pluginsSymbol](): LowCodePluginManager {
        if (this.workspaceMode) {
            return this[innerPluginsSymbol];
        }
        // const workspace = globalContext.get('workspace');
        // if (workspace.isActive) {
        //     return workspace.window.innerPlugins;
        // }

        return this[innerPluginsSymbol];
    }

    constructor(plugins: LowCodePluginManager, public workspaceMode: boolean = false) {
        this[innerPluginsSymbol] = plugins;
    }

    async register(
        pluginModel: IPublicTypePlugin,
        options?: any,
        registerOptions?: IPublicTypePluginRegisterOptions,
    ): Promise<void> {
        await this[pluginsSymbol].register(pluginModel, options, registerOptions);
    }

    async init(registerOptions: any) { 
        await this[pluginsSymbol].init(registerOptions);
    }
}