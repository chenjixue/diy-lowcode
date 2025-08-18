import { SettingsPrimaryPane } from "@/componets/settings-primary-pane";
import DesignerPlugin from "@/core/designer/designer";
// 注册默认的面板
export const defaultPanelRegistry = (editor: any) => {
  const fun = (ctx: any) => {
    return {
      init() {
        const { skeleton } = ctx;
        skeleton.add({
          area: 'mainArea',
          name: 'designer',
          type: 'Widget',
          content: <DesignerPlugin
            engineEditor={editor}
          />,
        });
      },
    };
  };

  fun.pluginName = '___default_panel___';

  return fun;
};


export default defaultPanelRegistry;
