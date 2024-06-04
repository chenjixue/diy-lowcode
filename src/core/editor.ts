import { engineConfig } from './plugin-manager';
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

  
export class Editor extends (EventEmitter as any) implements IPublicModelEditor {
    constructor(readonly viewName: string = 'global', readonly workspaceMode: boolean = false) {
      super();
    }
    set(key: IPublicTypeEditorValueKey, data: any): void | Promise<void> {
    //   if (key === 'assets') {
    //     return this.setAssets(data);
    //   }
      // store the data to engineConfig while invoking editor.set()
      if (!keyBlacklist.includes(key as string)) {
        engineConfig.set(key as any, data);
      }
    }
  }