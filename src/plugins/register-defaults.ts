import {parseProps, addonCombine} from "@/designer/transducers";
import {IPublicModelPluginContext} from "@/types";

export const registerDefaults = (ctx: IPublicModelPluginContext) => {
    const {material} = ctx;
    return {
        init() {
            // parseProps
            material.registerMetadataTransducer(parseProps, 5, 'parse-props');

            // 把组件props属性中的一些style属性给剔除出来，其余以数组形式的放进combineds[{name:'#props',items:propsGroup}]里面了
            material.registerMetadataTransducer(addonCombine, 10, 'combine-props');
        },
    };
};


registerDefaults.pluginName = '___register_defaults___';
