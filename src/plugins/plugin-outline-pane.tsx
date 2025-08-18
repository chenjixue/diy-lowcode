import { IconOutline } from "@/core/componets/icons/outline";
export const OutlinePlugin = (ctx: IPublicModelPluginContext, options: any) => {
  const { skeleton} = ctx;
  ctx.extraTitle = options && options['extraTitle'];
  const isInFloatArea = true;
  const MasterPaneName = 'outline-master-pane';
  return {
    async init() {
      skeleton.add({
        area: 'leftArea',
        name: 'outlinePane',
        type: 'PanelDock',
        index: -1,
        content: {
          name: MasterPaneName,
          props: {
            icon: IconOutline,
            description: "点击展开树",
          },
          content: (props: any) => {
          },
        },
      });
    },
  };
};
OutlinePlugin.pluginName = 'OutlinePlugin';