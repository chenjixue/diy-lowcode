
export const componentMetaParser = (designer: any) => {
  const fun = (ctx:any) => {
    return {
      init() {
        const { material } = ctx;
        material.onChangeAssets(() => {
          const assets = material.getAssets();
          const { components = [] } = assets;
          designer.buildComponentMetasMap(components);
        });
      },
    };
  };

  fun.pluginName = '___component_meta_parser___';

  return fun;
};
