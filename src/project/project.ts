import {DocumentModel} from "@/designer/document/document-model.ts";
import {computed, makeObservable, observable, observe, action} from "mobx";
import {IPublicTypeProjectSchema, IPublicTypeRootSchema} from "@/types";
import {Designer} from "@/designer/designer.ts";
import {createModuleEventBus, IEventBus} from "@/editor/event-bus.ts";

export class Project {
    private _simulator?
    private emitter: IEventBus = createModuleEventBus('Project')
    @observable.shallow readonly documents: DocumentModel[] = [];
    private data: IPublicTypeProjectSchema = {
        version: '1.0.0',
        componentsMap: [],
        componentsTree: [],
        i18n: {},
    };

    constructor(readonly designer: Designer, schema?: IPublicTypeProjectSchema, readonly viewName = 'global') {
        makeObservable(this);
        // this.load(schema);
    }

    onCurrentDocumentChange(fn: (doc: DocumentModel) => void): () => void {
        this.emitter.on('current-document.change', fn);
        return () => {
            this.emitter.removeListener('current-document.change', fn);
        };
    }

    getDocument(id: string): DocumentModel | null {
        // 此处不能使用 this.documentsMap.get(id)，因为在乐高 rollback 场景，document.id 会被改成其他值
        return this.documents.find((doc) => doc.id === id) || null;
    }

    /**
     * 模拟器
     */
    get simulator() {
        return this._simulator || null;
    }

    @computed get currentDocument(): DocumentModel | null | undefined {
        return this.documents.find((doc) => doc.active);
    }


    private documentsMap = new Map<string, DocumentModel>();


    @action
    createDocument(data?: IPublicTypeRootSchema): DocumentModel {
        const doc = new DocumentModel(this, data || this?.data?.componentsTree?.[0]);
        this.documents.push(doc);
        this.documentsMap.set(doc.id, doc);
        return doc;
    }

    checkExclusive(activeDoc: DocumentModel) {
        // this.documents.forEach((doc) => {
        //     if (doc !== activeDoc) {
        //         doc.suspense();
        //     }
        // });
        this.emitter.emit('current-document.change', activeDoc);
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
        // this.config = schema?.config || this.config;

        if (autoOpen === true) {
            // auto open first document or open a blank page
            // this.open(this.data.componentsTree[0]);
            const documentInstances = this.data.componentsTree.map((data) => this.createDocument(data));
            documentInstances[0].open();
        }
    }

}
