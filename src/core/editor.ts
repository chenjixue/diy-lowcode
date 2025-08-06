import { AssetLoader } from '@/util/asset';
import { engineConfig } from './plugin-manager';
import { computed, makeObservable, observable, observe } from "mobx";
// inner instance keys which should not be stored in config
const keyBlacklist = [
  'designer',
  'skeleton',
  'currentDocument',
  'simulator',
  'plugins',
  'setters',
  'material',
  'innerHotkey',
  'innerPlugins',
];

const AssetsCache: {
  [key: string]: IPublicTypeRemoteComponentDescription;
} = {};
export class Editor {
  @observable.shallow private context = new Map<any, any>();
  private waits = new Map();
  constructor(readonly viewName: string = 'global', readonly workspaceMode: boolean = false) {
    // super();
  }
  onChange(keyOrType:string, fn:()=>any) {
    this.setWait(keyOrType, fn);
    return () => {
      this.delWait(keyOrType, fn);
    };
  }
  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): any {
    return this.context.get(keyOrType as any);
  }
  set(key: any, data: any): void | Promise<void> {
    //   if (key === 'assets') {
    //     return this.setAssets(data);
    //   }
    // store the data to engineConfig while invoking editor.set()
    if (!keyBlacklist.includes(key as string)) {
      engineConfig.set(key as any, data);
    }
    this.context.set(key, data);
  }
  async setAssets(assets: IPublicTypeAssetsJson) {
    const { components } = assets;
    if (components && components.length) {
      const componentDescriptions: IPublicTypeComponentDescription[] = [];
      const remoteComponentDescriptions: IPublicTypeRemoteComponentDescription[] = [];
      components.forEach((component: any) => {
        if (!component) {
          return;
        }
        if (component.exportName && component.url) {
          remoteComponentDescriptions.push(component);
        } else {
          componentDescriptions.push(component);
        }
      });
      assets.components = componentDescriptions;
      assets.componentList = assets.componentList || [];

      // 如果有远程组件描述协议，则自动加载并补充到资产包中，同时出发 designer.incrementalAssetsReady 通知组件面板更新数据
      if (remoteComponentDescriptions && remoteComponentDescriptions.length) {
        await Promise.all(
          remoteComponentDescriptions.map(async (component: IPublicTypeRemoteComponentDescription) => {
            const { exportName, url, npm } = component;
            if (!url || !exportName) {
              return;
            }
            if (!AssetsCache[exportName] || !npm?.version || AssetsCache[exportName].npm?.version !== npm?.version) {
              await (new AssetLoader()).load(url);
            }
            AssetsCache[exportName] = component;
            function setAssetsComponent(component: any, extraNpmInfo: any = {}) {
              const components = component.components;
              assets.componentList = assets.componentList?.concat(component.componentList || []);
              if (Array.isArray(components)) {
                // 将远程url获取到的组件库加载到assets.components
                components.forEach(d => {
                  assets.components = assets.components.concat({
                    npm: {
                      ...npm,
                      ...extraNpmInfo,
                    },
                    ...d,
                  });
                });
                return;
              }
            }
            // function setArrayAssets(value: any[], preExportName: string = '', preSubName: string = '') {
            //   value.forEach((d: any, i: number) => {
            //     const exportName = [preExportName, i.toString()].filter(d => !!d).join('.');
            //     const subName = [preSubName, i.toString()].filter(d => !!d).join('.');
            //     Array.isArray(d) ? setArrayAssets(d, exportName, subName) : setAssetsComponent(d, {
            //       exportName,
            //       subName,
            //     });
            //   });
            // }
            if ((window as any)[exportName]) {
              if (Array.isArray((window as any)[exportName])) {
                // setArrayAssets((window as any)[exportName] as any);
              } else {
                setAssetsComponent((window as any)[exportName] as any);
              }
            }
            return (window as any)[exportName];
          }),
        );
      }
    }
    // const innerAssets = assetsTransform(assets);
    this.context.set('assets', assets);
    this.notifyGot('assets');
  }
  private notifyGot(key: IPublicTypeEditorValueKey) {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }
  private setWait(key: IPublicTypeEditorValueKey, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private delWait(key: IPublicTypeEditorValueKey, fn: any) {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }
}