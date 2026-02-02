function preprocessMetadata(metadata) {
    if (metadata.configure) {
        if (Array.isArray(metadata.configure)) {
            return {
                ...metadata,
                configure: {
                    props: metadata.configure,
                },
            };
        }
        return metadata as any;
    }

    return {
        ...metadata,
        configure: {},
    };
}

export class ComponentMeta {
    prototype?: any;
    private _npm?: any;
    private _title?: any;
    private _componentName?: string;
    private _transformedMetadata?: any;

    get componentName(): string {
        return this._componentName!;
    }

    constructor(readonly designer: Designer, metadata: any) {
        this.parseMetadata(metadata);
    }

    getMetadata() {
        return this._transformedMetadata!;
    }

    get configure() {
        const config = this._transformedMetadata?.configure;
        return config?.combined || config?.props || []
    }

    get npm() {
        return this._npm;
    }

    get advanced() {
        return this.getMetadata().configure.advanced || {};
    }

    private parseMetadata(metadata: any) {
        const {componentName, npm, ...others} = metadata;
        let _metadata = metadata;
        if ((metadata as any).prototype) {
            this.prototype = (metadata as any).prototype;
        }
        this._npm = npm || this._npm;
        this._componentName = componentName;

        // 额外转换逻辑
        this._transformedMetadata = this.transformMetadata(_metadata);
        // console.log(this._transformedMetadata, "this._transformedMetadata")
        const {title} = this._transformedMetadata;
        if (title) {
            this._title =
                typeof title === 'string'
                    ? {
                        type: 'i18n',
                        'en-US': this.componentName,
                        'zh-CN': title,
                    }
                    : title;
        }
    }

    private transformMetadata(
        metadta: any,
    ): any {
        const registeredTransducers = this.designer.componentActions.getRegisteredMetadataTransducers();
        const result = registeredTransducers.reduce((prevMetadata, current) => {
            return current(prevMetadata);
        }, preprocessMetadata(metadta));
        return result as any;
    }

}
