export default class PluginContext {
    hotkey
    project
    skeleton
    setters
    material
    event
    config
    common
    logger
    plugins
    preference
    pluginEvent
    canvas

    set workspace(workspace) {
    }

    constructor(
        options: any,
        contextApiAssembler: any,
    ) {
        const {pluginName = 'anonymous', meta = {}} = options;
        contextApiAssembler.assembleApis(this, pluginName, meta);
    }
}
