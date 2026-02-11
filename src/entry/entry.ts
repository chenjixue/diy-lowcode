import {OutlinePlugin} from "@/plugins/plugin-outline-pane/plugin-outline-pane.tsx";
import ReactDOM from 'react-dom'
import {Skeleton} from "@/sketeton/shell/skeleton.ts";
import {LowCodePluginManager} from "@/plugin-manager/plugin-manager.ts";
import {Plugins} from "@/plugin-manager/plugins.ts";
import defaultPanelRegistry from "@/plugins/default-panel-registry.tsx";
import {
    Skeleton as InnerSkeleton,
} from '@/sketeton/skeleton.ts';
import {createElement} from "react";
import EditorInitPlugin from "@/plugins/plugin-editor-init.tsx";
import {Project} from "@/shell/project.ts";
import {Material} from "@/shell/material.ts";
import {componentMetaParser} from "@/plugins/component-meta-parser.ts";
import {Editor} from "@/editor/editor.ts";
import {ILowCodePluginContextPrivate, IPublicTypePluginMeta} from "@/types";
import {Designer} from "@/designer/designer.ts";
import {Workbench} from "@/sketeton/layouts/workbench.tsx";
import {registerDefaults} from "@/plugins/register-defaults.ts";
import {Setters as InnerSetters} from "@/editor/setters.ts";
import {Setters} from "@/shell/setters.ts";
import {Common} from "@/shell/common.ts";
import {shellModelFactory} from "@/designer/shell-model-factory.ts";
import {setterRegistry} from "@/plugins/setter-registry.ts";

export interface ILowCodePluginContextApiAssembler {
    assembleApis(
        context: ILowCodePluginContextPrivate,
        pluginName: string,
        meta: IPublicTypePluginMeta,
    ): void;
}

// 注册一批内置插件
async function registryInnerPlugin(designer: any, editor: any, plugins: Plugins) {
    const componentMetaParserPlugin = componentMetaParser(designer);
    await plugins.register(componentMetaParserPlugin, {},)
    await plugins.register(EditorInitPlugin, {},);
    await plugins.register(setterRegistry, {});
    await plugins.register(defaultPanelRegistry(editor), {},);
    await plugins.register(OutlinePlugin, {},);
    await plugins.register(registerDefaults, {}, {autoInit: true});
}

const editor = new Editor();

const designer = new Designer({editor, shellModelFactory});
const material = new Material(editor);
const hotkey = {
    bind: () => {
    }
}
// 执行操作的project
const {project: innerProject} = designer;
// shell project
const project = new Project(innerProject);

const innerSetters = new InnerSetters();
const setters = new Setters(innerSetters);
editor.set('designer' as any, designer);
editor.set('setters' as any, setters);

// 页面的核心骨架负责调控一切,也作为LowCodePluginManager对象的核心功能，同时UI也从其身上拿资源去渲染
const innerSkeleton = new InnerSkeleton();

const skeleton = new Skeleton(innerSkeleton, 'any', false);

const common = new Common(editor, innerSkeleton);
// 被LowCodePluginManager对象使用,LowCodePluginManager对象创建一个context对象调用该方法并创建新的属性添加，他的大多数能力也是通过创建的context进行操作
const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
    assembleApis: (context: ILowCodePluginContextPrivate, pluginName: string, meta: IPublicTypePluginMeta) => {
        context.project = project;
        context.skeleton = new Skeleton(innerSkeleton, pluginName, false);
        context.material = material;
        context.setters = setters;
    },
};
// 低代码插件管理者 主要用于全局各种context的初始化与保存以及全局插件的注册与初始化
const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler);
// 切换模式看具体使用那大类的插件
let plugins = new Plugins(innerPlugins)
// const innerWorkspace: IWorkspace = new InnerWorkspace(registryInnerPlugin, shellModelFactory);
await registryInnerPlugin(designer, editor, plugins);
(window as any).AliLowCodeEngine = {
    material,
    project,
    hotkey,
}

export {
    material,
    project,
    common,
    setters,
    skeleton,
    hotkey,
}

export async function init(
    container?: HTMLElement,
    // options?: IPublicTypeEngineOptions,
) {
    //初始化流程开始的起点
    await plugins.init({});
    //ui渲染会拿到innerSkeleton对象上的资源进行渲染
    ReactDOM.createRoot(container!).render(
        createElement(Workbench, {
            skeleton: innerSkeleton,
            className: 'engine-main',
        })
    )
}
