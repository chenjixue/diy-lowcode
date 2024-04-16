import { IWidget } from "./area";
import { DockConfig, Skeleton } from "./editor-skeleton";
export class Dock implements IWidget {
    readonly name: string;
    constructor(readonly skeleton: Skeleton, readonly config: DockConfig) {
        const { name } = config;
        this.name = name
    }
}