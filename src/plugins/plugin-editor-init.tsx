import { IPublicModelPluginContext } from '@alilc/lowcode-types';
// import { injectAssets } from '@alilc/lowcode-plugin-inject';
import assets from '../services/assets.json';
import { getProjectSchema } from "../services/mockService"
const EditorInitPlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const { material, project, config } = ctx;
      // const scenarioName = options['scenarioName'];
      // const scenarioDisplayName = options['displayName'] || scenarioName;
      // const scenarioInfo = options['info'] || {};
      // // 保存在 config 中用于引擎范围其他插件使用
      // config.set('scenarioName', scenarioName);
      // config.set('scenarioDisplayName', scenarioDisplayName);
      // config.set('scenarioInfo', scenarioInfo);

      // // 设置物料描述

      await material.setAssets(assets);

      const schema = await getProjectSchema("");
      // // 加载 schema
      // project.importSchema(schema as any);
    },
  };
}
EditorInitPlugin.pluginName = 'EditorInitPlugin';
export default EditorInitPlugin;
