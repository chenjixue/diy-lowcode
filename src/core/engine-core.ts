import { OutlinePlugin } from "@/plugins/plugin-outline-pane";
import { Editor } from "./editor";
import ReactDOM from 'react-dom/client'
import { Skeleton } from "@/shell/api/skeleton";
import { ILowCodePluginContextPrivate, IPublicTypePluginMeta, LowCodePluginManager } from "./plugin-manager";
import { Plugins } from "./plugins";
// src\core\componets\designer.tsx
import defaultPanelRegistry from "@/plugins/default-panel-registry";
import {
  Skeleton as InnerSkeleton,
} from './editor-skeleton';
import { createElement } from "react";
import { Workbench } from "@/layout/workbench";
import { Designer } from "@/core/designer/designer";
import EditorInitPlugin from "@/plugins/plugin-editor-init";
import { Project } from "@/shell/api/project";
import { Material } from "@/shell/api/material";
import { componentMetaParser } from "@/plugins/component-meta-parser";
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
  await plugins.register(componentMetaParserPlugin);
  await plugins.register(EditorInitPlugin, {
    scenarioName: 'general',
    displayName: '综合场景',
    info: {
      urls: [
        {
          key: '设计器',
          value: 'https://github.com/alibaba/lowcode-demo/tree/main/demo-general',
        },
        {
          key: 'fusion-ui 物料',
          value: 'https://github.com/alibaba/lowcode-materials/tree/main/packages/fusion-ui',
        },
        {
          key: 'fusion 物料',
          value: 'https://github.com/alibaba/lowcode-materials/tree/main/packages/fusion-lowcode-materials',
        }
      ],
    },
  });
  await plugins.register(OutlinePlugin, {}, { autoInit: true });
  await plugins.register(defaultPanelRegistry(editor), {}, { autoInit: true });
}


const editor = new Editor();
const designer = new Designer();
const material = new Material(editor);
// 执行操作的project
const { project: innerProject } = designer;
// shell project
const project = new Project(innerProject);
editor.set('designer' as any, designer);
// 页面的核心骨架负责调控一切,也作为LowCodePluginManager对象的核心功能，同时UI也从其身上拿资源去渲染
const innerSkeleton = new InnerSkeleton();
// 被LowCodePluginManager对象使用,LowCodePluginManager对象创建一个context对象调用该方法并创建新的属性添加，他的大多数能力也是通过创建的context进行操作
const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
  assembleApis: (context: ILowCodePluginContextPrivate, pluginName: string, meta: IPublicTypePluginMeta) => {
    context.project = project;
    context.skeleton = new Skeleton(innerSkeleton, pluginName, false);
    context.material = material;
  },
};
// 低代码插件管理者 主要用于全局各种context的初始化与保存以及全局插件的注册与初始化
const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler);
// 切换模式看具体使用那大类的插件
let plugins = new Plugins(innerPlugins)
// const innerWorkspace: IWorkspace = new InnerWorkspace(registryInnerPlugin, shellModelFactory);
registryInnerPlugin({}, editor, plugins);
export {
  material,
  project
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
