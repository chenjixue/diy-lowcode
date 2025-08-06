import { computed, observable, makeObservable } from "mobx";
export class DocumentModel {
    readonly project: any;
    readonly designer: any;
    constructor(project: any, schema?: IPublicTypeRootSchema) {
        makeObservable(this);
        this.project = project;
        this.designer = this.project?.designer;
    }
}