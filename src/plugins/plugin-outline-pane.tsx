import { IconOutline } from "@/core/componets/icons/outline";

export const OutlinePlugin = (ctx: IPublicModelPluginContext, options: any) => {
  const { skeleton, config, common, event, canvas, project } = ctx;
  ctx.extraTitle = options && options['extraTitle'];
  // let isInFloatArea = true;
  // const hasPreferenceForOutline = config.getPreference().contains('outline-pane-pinned-status-isFloat', 'skeleton');
  // if (hasPreferenceForOutline) {
  //   isInFloatArea = config.getPreference().get('outline-pane-pinned-status-isFloat', 'skeleton');
  // }
  return {
    async init() {
      skeleton.add({
        area: 'leftArea',
        name: 'outlinePane',
        type: 'PanelDock',
        index: -1,
        content: {
          // name: MasterPaneName,
          props: {
            icon: IconOutline,
            description: "点击展开树",
          },
        },
      });
    },
  };
};
OutlinePlugin.pluginName = 'OutlinePlugin';