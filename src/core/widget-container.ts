export interface WidgetItem{
    name:string
}
export class WidgetContainer<T extends WidgetItem>{
    constructor(readonly name:string, private handle:(item:T)=>T){
    }
    add(item:T):T{
        item = this.handle(item)
        return item
    }
}