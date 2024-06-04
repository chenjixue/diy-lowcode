import { SettingsPrimaryPane } from "@/componets/settings-primary-pane";
// 注册默认的面板
export const defaultPanelRegistry = (editor: any) => {
  const fun = (ctx: any) => {
    return {
      init() {
        const { skeleton } = ctx;
        skeleton.add({
          area: 'rightArea',
          name: 'settingsPane',
          type: 'Panel',
          content: <SettingsPrimaryPane />,
        });
      },
    };
  };

  fun.pluginName = '___default_panel___';

  return fun;
};


export default defaultPanelRegistry;
