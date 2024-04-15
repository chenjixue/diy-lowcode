import {IWidget,Area} from "@/core/area"
export class Skeleton {
    readonly leftArea;
    constructor(){
        this.leftArea = new Area(this,"leftArea",()=>{
            
        })
    }
    createContainer(name:string,handle:(item:IWidget)=>IWidget){
        
    }
}