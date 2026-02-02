// import {componentDefaults, legacyIssues} from "@/plugin-manager/designer/component-actions.ts";

import {componentDefaults} from "@/designer/transducers";

export class ComponentActions {
    private metadataTransducers: any[] = [];

    constructor() {
        this.registerMetadataTransducer(componentDefaults, 100, 'component-defaults');
    }

    registerMetadataTransducer(
        transducer: any,
        level = 100,
        id?: string,
    ) {
        transducer.level = level;
        transducer.id = id;
        const i = this.metadataTransducers.findIndex((item) => item.level != null && item.level > level);
        if (i < 0) {
            this.metadataTransducers.push(transducer);
        } else {
            this.metadataTransducers.splice(i, 0, transducer);
        }
    }

    getRegisteredMetadataTransducers(): any[] {
        return this.metadataTransducers;
    }
}
