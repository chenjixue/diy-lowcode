export interface WidgetItem {
    name: string
}
export class WidgetContainer<T extends WidgetItem = any> {
    items: T[] = [];
    private maps: { [name: string]: T } = {};
    constructor(readonly name: string, private handle: (item: T) => T) {
    }
    add(item: T): T {
        item = this.handle(item)
        const origin = this.get(item.name);
        if (origin === item) {
            return origin;
        }
        const i = origin ? this.items.indexOf(origin) : -1;
        if (i > -1) {
            this.items[i] = item;
        } else {
            this.items.push(item);
        }
        this.maps[item.name] = item;
        return item
    }
    get(name: string): T | null {
        return this.maps[name] || null;
    }
}