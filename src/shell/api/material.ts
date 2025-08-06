import { ComponentType } from 'react';
import { designerSymbol, editorSymbol } from './symbols';


const innerEditorSymbol = Symbol('editor');
export class Material implements IPublicApiMaterial {
  private [innerEditorSymbol]: IPublicModelEditor;

  get [editorSymbol](): IPublicModelEditor {
    return this[innerEditorSymbol];
  }

  get [designerSymbol](): IDesigner {
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

  /**
   * 获取「资产包」结构
   * @returns
   */
  getAssets(): IPublicTypeAssetsJson | undefined {
    return this[editorSymbol].get('assets');
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
