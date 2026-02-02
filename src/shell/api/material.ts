import {ComponentType} from 'react';
import {designerSymbol, editorSymbol} from './symbols';
import {
    IPublicApiMaterial,
    IPublicModelEditor,
    IPublicTypeAssetsJson,
    IPublicTypeDisposable,
    IPublicTypeNpmInfo
} from "@/types";
import {Designer} from "@/designer/designer.ts";


const innerEditorSymbol = Symbol('editor');

interface IDesigner {
}

export class Material implements IPublicApiMaterial {
    private [innerEditorSymbol]: IPublicModelEditor;
    private configure;

    get [editorSymbol](): IPublicModelEditor {
        return this[innerEditorSymbol];
    }

    get [designerSymbol](): Designer {
        return this[editorSymbol].get('designer')!;
    }

    constructor(editor: any, readonly workspaceMode: boolean = false) {
        this[innerEditorSymbol] = editor;
    }

    /**
     * 获取组件 map 结构
     */
    get componentsMap(): { [key: string]: IPublicTypeNpmInfo | ComponentType<any> | object } {
        return this[designerSymbol].componentsMap;
    }

    /**
     * 设置「资产包」结构
     * @param assets
     * @returns
     */
    async setAssets(assets: IPublicTypeAssetsJson) {
        return await this[editorSymbol].setAssets(assets);
    }

    registerMetadataTransducer = (
        transducer: any,
        level?: number,
        id?: string | undefined,
    ) => {
        this[designerSymbol].componentActions.registerMetadataTransducer(transducer, level, id);
    };

    /**
     * 获取「资产包」结构
     * @returns
     */
    getAssets() {
        return this[editorSymbol].get('assets');
    }

    addBuiltinComponentAction() {

    }

    /**
     * 监听 assets 变化的事件
     * @param fn
     */
    onChangeAssets(fn: () => void): IPublicTypeDisposable {
        const dispose = [
            // 设置 assets，经过 setAssets 赋值
            this[editorSymbol].onChange('assets', fn),
        ];

        return () => {
            dispose.forEach(d => d && d());
        };
    }
}
