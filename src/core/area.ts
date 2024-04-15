import { Sketeton } from "./editor-skeleton";
import { WidgetContainer } from "./widget-container";

export interface IArea<C,T>{
    add(config:C):T;
}
export interface IWidget {
    name:string
}
export interface IPublicTypeWidgetBaseConfig{
    
}
export class Area<C extends IPublicTypeWidgetBaseConfig = any,T extends IWidget = IWidget > implements IArea<C,T>{
    readonly container:WidgetContainer<T>
    constructor(readonly skeleton:Sketeton,readonly name:string, handle:(item:T)=>T){
        this.container = Sketeton.createContainer(name,handle)
    }
    add(config:C):T{
        // return this.container.add(confis)
        return 
    }
  
}