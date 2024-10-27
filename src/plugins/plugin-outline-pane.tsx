import { IconOutline } from "@/core/componets/icons/outline";
export const OutlinePlugin = (ctx: IPublicModelPluginContext, options: any) => {
  const { skeleton, config, common, event, canvas, project } = ctx;
  ctx.extraTitle = options && options['extraTitle'];
  let isInFloatArea = true;
  // const hasPreferenceForOutline = config.getPreference().contains('outline-pane-pinned-status-isFloat', 'skeleton');
  // if (hasPreferenceForOutline) {
  //   isInFloatArea = config.getPreference().get('outline-pane-pinned-status-isFloat', 'skeleton');
  // }
  const BackupPaneName = 'outline-backup-pane';
  const MasterPaneName = 'outline-master-pane';
  let masterPaneController: PaneController | null = null;
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
            masterPaneController = new PaneController(MasterPaneName, ctx, treeMaster);
            return (
              <Pane
                config={config}
                pluginContext={ctx}
                treeMaster={treeMaster}
                controller={masterPaneController}
                {...props}
              />
            );
          },
        },
        panelProps: {
          area: isInFloatArea ? 'leftFloatArea' : 'leftFixedArea',
          keepVisibleWhileDragging: true,
          // ...config.get('defaultOutlinePaneProps'),
        },
        contentProps: {
          // treeTitleExtra: config.get('treeTitleExtra'),
        },
      });
    },
  };
};
OutlinePlugin.pluginName = 'OutlinePlugin';