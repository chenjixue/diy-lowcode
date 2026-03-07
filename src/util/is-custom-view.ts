import {isReactComponent} from "@/util/render-util.ts";
import {isValidElement} from "react";

export function isCustomView(obj: any) {
    if (!obj) {
        return false;
    }
    return isValidElement(obj) || isReactComponent(obj);
}
