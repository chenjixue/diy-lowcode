import {makeObservable, observable} from "mobx";
import {createModuleEventBus} from "@/editor/event-bus.ts";
import {DocumentModel} from "@/designer/document/document-model.ts";

export default class Selection {
    @observable.shallow private _selected: string[] = [];
    private emitter = createModuleEventBus('Selection');

    constructor(readonly doc: DocumentModel) {
        makeObservable(this);
    }

    get selected(): string[] {
        return this._selected;
    }

    select(id: string) {
        this._selected = [id];
        this.emitter.emit('selectionchange', this._selected);
    }

    onSelectionChange(fn: (ids: string[]) => void): () => void {
        this.emitter.on('selectionchange', fn);
        return () => {
            this.emitter.removeListener('selectionchange', fn);
        };
    }

    getNodes() {
        const nodes = [];
        for (const id of this._selected) {
            const node = this.doc.getNode(id);
            if (node) {
                nodes.push(node);
            }
        }
        return nodes;
    }
}
