import { IWidget } from "../area.ts";
import { DockConfig, Skeleton } from "../skeleton.ts";
export class Dock implements IWidget {
    readonly name: string;
    constructor(readonly skeleton: Skeleton, readonly config: DockConfig) {
        const { name } = config;
        this.name = name
    }
}
