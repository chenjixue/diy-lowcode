import { IWidget } from "./area";
import { PanelConfig, Skeleton } from "./editor-skeleton";

export class Panel implements IWidget {
    readonly name: string;
    constructor(readonly skeleton: Skeleton, readonly config: PanelConfig) {
        const { name } = config;
        this.name = name;
    }
}