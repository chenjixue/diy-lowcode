import store from 'store';
import {get as lodashGet} from 'lodash';
import {
    IEngineConfigPrivate,
    ILowCodePluginContextApiAssembler,
    ILowCodePluginContextPrivate,
    ILowCodePluginManagerCore,
    ILowCodePluginRuntime,
    IPluginContextOptions, IPluginPreferenceMananger, IPublicApiCanvas,
    IPublicApiCommon,
    IPublicApiHotkey,
    IPublicApiLogger,
    IPublicApiMaterial,
    IPublicApiPlugins,
    IPublicApiProject,
    IPublicApiSetters,
    IPublicApiSkeleton,
    IPublicApiWorkspace,
    IPublicModelEngineConfig,
    IPublicModelPluginContext,
    IPublicModelPreference,
    IPublicTypeEngineOptions,
    IPublicTypePlugin, IPublicTypePluginConfig,
    IPublicTypePluginDeclaration, IPublicTypePluginMeta,
    IPublicTypePluginRegisterOptions,
    IPublicTypePreferenceValueType
} from "@/types";
import { IPublicApiEvent } from '@/editor-core/event-bus';

export function isObject(value: any): value is Record<string, unknown> {
    return value !== null && typeof value === 'object';
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
            return;
        }
        const storageKey = this.getStorageKey(key, module);
        store.set(storageKey, value);
    }

    get(key: string, module: string): any {
        if (!key || typeof key !== 'string' || key.length === 0) {
            return;
        }
        const storageKey = this.getStorageKey(key, module);
        const result = store.get(storageKey);
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
            return () => {
            };
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
            waits.push({resolve, once});
        } else {
            this.waits.set(key, [{resolve, once}]);
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

export class LowCodePluginContext implements IPublicModelPluginContext, ILowCodePluginContextPrivate {
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
        const {pluginName = 'anonymous', meta = {}} = options;
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


export class LowCodePluginRuntime implements ILowCodePluginRuntime {
    config: IPublicTypePluginConfig;

    private manager: ILowCodePluginManager;

    private _inited: boolean;

    private pluginName: string;

    meta: IPublicTypePluginMeta;

    get name() {
        return this.pluginName;
    }

    get dep() {
        return [];
    }

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
        const {pluginName} = options;
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
        let {pluginName, meta = {}} = pluginModel;
        const ctx = this._getLowCodePluginContext({pluginName, meta});
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
        const {missingTasks, sequence} = sequencify(pluginObj, pluginNames);
        invariant(!missingTasks.length, 'plugin dependency missing', missingTasks);
        for (const pluginName of sequence) {
            try {
                await this.pluginsMap.get(pluginName)!.init();
            } catch (e) /* istanbul ignore next */ {
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
