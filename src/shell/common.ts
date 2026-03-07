import {Editor} from "@/editor/editor.ts";
import {Skeleton as InnerSkeleton} from "@/sketeton/skeleton.ts";
import {ReactNode} from "react";

export const editorSymbol = Symbol('editor');

class EditorCabin {
    private readonly [editorSymbol]: Editor;

    constructor(editor: Editor) {
        this[editorSymbol] = editor;
    }

    createSetterContent = (setter: any, props: Record<string, any>): ReactNode => {
        const setters = this[editorSymbol].get('setters');
        return setters.createSetterContent(setter, props);
    };
}

export class Common {
    private readonly __editorCabin: any;

    constructor(editor: Editor, skeleton: InnerSkeleton) {
        this.__editorCabin = new EditorCabin(editor);
    }

    get editorCabin(): any {
        return this.__editorCabin;
    }
}
