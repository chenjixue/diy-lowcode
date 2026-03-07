import { IPublicModelPluginContext } from '@alilc/lowcode-types';
// import { injectAssets } from '@alilc/lowcode-plugin-inject';
import assets from '../services/assets.json';
import { getProjectSchema } from "../services/mockService"
const EditorInitPlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const { material, project, config } = ctx;
      // // 设置物料描述

      await material.setAssets(assets);

      const schema = await getProjectSchema("");
      console.log(schema,"schema---");
      // // 加载 schema
      project.importSchema(schema as any);
    },
  };
}
EditorInitPlugin.pluginName = 'EditorInitPlugin';
export default EditorInitPlugin;
