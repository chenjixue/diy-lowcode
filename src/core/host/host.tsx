import { getPublicPath } from "@/util/get-public-path";
import { createSimulator } from "@/core/builtin-simulator/create-simulator.tsx";
import { AssetLevel, AssetType } from "../types";
import { autorun, observable } from "mobx"
import { assetItem } from "@/util/asset";
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

const defaultEnvironment = [
    // https://g.alicdn.com/mylib/??react/16.11.0/umd/react.production.min.js,react-dom/16.8.6/umd/react-dom.production.min.js,prop-types/15.7.2/prop-types.min.js
    assetItem(
        AssetType.JSText,
        'window.React=parent.React;window.ReactDOM=parent.ReactDOM;window.__is_simulator_env__=true;',
        undefined,
        'react',
    ),
    assetItem(
        AssetType.JSText,
        'window.PropTypes=parent.PropTypes;React.PropTypes=parent.PropTypes; window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;',
    ),
];

export class BuiltinSimulatorHost {
    readonly project
    readonly designer
    private _renderer;
    private _iframe;
    private _contentWindow;
    private _contentDocument;
    readonly libraryMap: { [key: string]: string } = {};
    @observable.ref _props = {};
    get renderer() {
        return this._renderer;
    }
    get(key: string): any {
        return this._props[key];
    }
    setProps(props) {
        this._props = props;
    }
    set(key: string, value: any) {
        this._props = {
            ...this._props,
            [key]: value,
        };
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
        const libraryAsset = this.buildLibrary();
        const vendors = [
            // required & use once
            assetBundle(
                defaultEnvironment,
                AssetLevel.Environment,
            ),
            // 加载渲染schema所需组件库
            assetBundle(libraryAsset, AssetLevel.Library),
            assetBundle(
                defaultSimulatorUrl,
                AssetLevel.Runtime,
            ),
        ]

        // wait 准备 iframe 内容、依赖库注入
        const simulatorRendererContainer = await createSimulator(this, iframe, vendors);
        // step 5 ready & render
        simulatorRendererContainer.run();
        // TODO: dispose the bindings
    }
    buildLibrary(library?: []) {
        const _library = library || (this.get('library'));
        const libraryAsset: any[] = [];
        if (_library && _library.length) {
            _library.forEach((item) => {
                this.libraryMap[item.package] = item.library;
                if (item.editUrls) {
                    libraryAsset.push(item.editUrls);
                } else if (item.urls) {
                    libraryAsset.push(item.urls);
                }
            })
        }
        return libraryAsset;
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
    autorun(effect: (reaction: IReactionPublic) => void, options?: IReactionOptions): any {
        return autorun(effect, options);
    }

}