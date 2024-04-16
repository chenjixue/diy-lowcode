import { IWidget } from "./area";
import { PanelDockConfig, Skeleton } from "./editor-skeleton";

export class PanelDock implements IWidget{
    readonly name: string;
    constructor(readonly skeleton: Skeleton,readonly config: PanelDockConfig){
        const {name} = config
        this.name =name 
    }
}