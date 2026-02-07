import SetterComponents from "@/sketeton/component/setter"
// 注册默认的 setters
export const setterRegistry = (ctx) => {
    return {
        init() {
            const builtinSetters = SetterComponents?.setters;
            if (builtinSetters) {
                ctx.setters.registerSetter(builtinSetters);
            }
        },
    };
};

setterRegistry.pluginName = '___setter_registry___';
