import { Skeleton } from "../editor-skeleton";

export interface IPublicTypeWidgetBaseConfig {
    [extra: string]: any;
    name: string,
    skeleton: Skeleton;
    content?: Object
}