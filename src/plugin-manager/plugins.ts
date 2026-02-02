import { LowCodePluginManager } from './plugin-manager';
import {IPublicTypePlugin, IPublicTypePluginRegisterOptions} from "@/types";
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
