import { OutlinePlugin } from "@/plugins/plugin-outline-pane";
// import { Editor } from "./editor";
import ReactDOM from 'react-dom/client'
import { Skeleton } from "@/shell/api/skeleton";
import { ILowCodePluginContextPrivate, IPublicTypePluginMeta, LowCodePluginManager } from "./plugin-manager";
import { Plugins } from "./plugins";
import defaultPanelRegistry from "@/plugins/default-panel-registry";
import {
  Skeleton as InnerSkeleton,
} from './editor-skeleton';
import { createElement } from "react";
import { Workbench } from "@/layout/workbench";
export interface ILowCodePluginContextApiAssembler {
  assembleApis(
    context: ILowCodePluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ): void;
}
async function registryInnerPlugin(designer: any, editor: any, plugins: Plugins) {
  // 注册一批内置插件
  await plugins.register(OutlinePlugin, {}, { autoInit: true });
  await plugins.register(defaultPanelRegistry(editor));
}
// const editor = new Editor();
const innerSkeleton = new InnerSkeleton();

// const designer = new Designer({ editor, shellModelFactory });
const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  assembleApis: (context: ILowCodePluginContextPrivate, pluginName: string, meta: IPublicTypePluginMeta) => {
    context.skeleton = new Skeleton(innerSkeleton, pluginName, false);
    // context.config = config;
  },
};
const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler);

let plugins: Plugins;
plugins = new Plugins(innerPlugins).toProxy();
registryInnerPlugin({}, {}, plugins);
export async function init(
  container?: HTMLElement,
  // options?: IPublicTypeEngineOptions,
) {
  await plugins.init({});
  ReactDOM.createRoot(container!).render(
    createElement(Workbench, {
      skeleton: innerSkeleton,
      className: 'engine-main',
    })
  )
}