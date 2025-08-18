// import { IPublicEnumTransformStage } from "../react-simulator-renderer/renderer";

import { IPublicEnumTransformStage } from "../types";
import { makeObservable, observable } from "mobx";
import Prop from "./prop"
export class Props {
    readonly owner;
    @observable.shallow private items: any[] = [];
    constructor(owner: any, value?: any, extras?: any) {
        this.owner = owner;
        this.items = Object.keys(value).map((key) => new Prop(this, value[key], key, false));
    }
    export(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Save) {
        if (this.items.length < 1) {
            return {};
        }
        let allProps = {} as any;
        // let props: any = {};
        // const extras: any = {};
        this.items.forEach((item) => {
            let name = item.key as string;
            let value = item.export(stage);
            if (value != null) {
                allProps[name] = value;

            }
        });

        return { props: allProps };
    }
}