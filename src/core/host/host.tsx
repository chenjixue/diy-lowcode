import { getPublicPath } from "@/util/get-public-path";
import { createSimulator } from "@/core/builtin-simulator/create-simulator.tsx";
import { AssetLevel } from "../types";
import {autorun} from "mobx"
export function assetBundle(assets, level) {
    if (!assets) {
        return null;
    }
    return {
        type: "bundle",
        assets: assets,
        level: level
    };
}

const defaultSimulatorUrl = (() => {
    const publicPath = getPublicPath();
    let urls;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, prefix = '', dev] = /^(.+?)(\/js)?\/?$/.exec(publicPath) || [];
    // if (dev) {
    //     urls = [
    //         `${prefix}/css/react-simulator-renderer.css`,
    //         `${prefix}/js/react-simulator-renderer.js`,
    //     ];
    // } else if (process.env.NODE_ENV === 'production') {
    //     urls = [`${prefix}/react-simulator-renderer.css`, `${prefix}/react-simulator-renderer.js`];
    // } else {
    //     urls = [`${prefix}/react-simulator-renderer.css`, `${prefix}/react-simulator-renderer.js`];
    // }
    // "http://localhost:8081/src/core/react-simulator-renderer/renderer.ts"
    urls = [
        `${prefix || "src"}/core/react-simulator-renderer/renderer.ts`
    ];
    return urls;
})();
export class BuiltinSimulatorHost {
    readonly project
    readonly designer
    private _renderer;
    private _iframe;
    private _contentWindow;
    private _contentDocument

    get renderer() {
        return this._renderer;
    }

    constructor(project: Project, designer: Designer) {
        this.project = project;
        this.designer = designer;
    }

    async mountContentFrame(iframe: HTMLIFrameElement | null): Promise<void> {
        if (!iframe || this._iframe === iframe) {
            return;
        }
        this._iframe = iframe;

        this._contentWindow = iframe.contentWindow!;
        this._contentDocument = this._contentWindow.document;
        const vendors = [
            assetBundle(
                defaultSimulatorUrl,
                AssetLevel.Runtime,
            ),
        ]

        // wait 准备 iframe 内容、依赖库注入
        const renderer = await createSimulator(this, iframe, vendors);
        // step 5 ready & render
        // renderer.run();
        // TODO: dispose the bindings
    }

    /**
     * 有 Renderer 进程连接进来，设置同步机制
     */
    connect(
        renderer: BuiltinSimulatorRenderer,
        effect: (reaction: IReactionPublic) => void, options?: IReactionOptions,
    ) {
        this._renderer = renderer;
        return autorun(effect, options);
    }
    autorun(effect: (reaction: IReactionPublic) => void, options?: IReactionOptions): any  {
        return autorun(effect, options);
    }

}