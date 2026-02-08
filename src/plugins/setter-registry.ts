// 注册默认的 setters
export const setterRegistry = (ctx) => {
    return {
        async init() {
            const { default: SetterComponents } = await import("@/sketeton/component/setter");
            const builtinSetters = SetterComponents?.setters;
            if (builtinSetters) {
                ctx.setters.registerSetter(builtinSetters);
            }
        },
    };
};

setterRegistry.pluginName = '___setter_registry___';
