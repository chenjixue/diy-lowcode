
import { DocumentModel } from "@/core/designer/document-model";
import { computed, makeObservable, observable, observe, action } from "mobx";
export class Project implements IProject {

  @observable.shallow readonly documents: IDocumentModel[] = [];

  private data: IPublicTypeProjectSchema = {
    version: '1.0.0',
    componentsMap: [],
    componentsTree: [],
    i18n: {},
  };

  private _simulator?: ISimulatorHost;
  /**
   * 模拟器
   */
  get simulator(): ISimulatorHost | null {
    return this._simulator || null;
  }

  @computed get currentDocument(): IDocumentModel | null | undefined {
    return this.documents.find((doc) => doc.active);
  }


  private documentsMap = new Map<string, DocumentModel>();

  constructor(readonly designer: IDesigner, schema?: IPublicTypeProjectSchema, readonly viewName = 'global') {
    makeObservable(this);
    // this.load(schema);
  }
  @action
  createDocument(data?: IPublicTypeRootSchema): IDocumentModel {
    const doc = new DocumentModel(this, data || this?.data?.componentsTree?.[0]);
    this.documents.push(doc);
    this.documentsMap.set(doc.id, doc);
    return doc;
  }

  load(schema?: IPublicTypeProjectSchema, autoOpen?: boolean | string) {
    // this.unload();
    // load new document
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      i18n: {},
      ...schema,
    };
    this.config = schema?.config || this.config;

    if (autoOpen === true) {
      // auto open first document or open a blank page
      // this.open(this.data.componentsTree[0]);
      const documentInstances = this.data.componentsTree.map((data) => this.createDocument(data));
      // TODO: 暂时先读 config tabBar 里的值，后面看整个 layout 结构是否能作为引擎规范
      //   if (this.config?.layout?.props?.tabBar?.items?.length > 0) {
      //     // slice(1) 这个贼不雅，默认任务 fileName 是类'/fileName'的形式
      //     documentInstances
      //       .find((i) => i.fileName === this.config.layout.props.tabBar.items[0].path?.slice(1))
      //       ?.open();
      //   } else {
      //     documentInstances[0].open();
      //   }
      // }
    }
  }

}