import {IPublicTypeIconType, IPublicTypeTitleContent, TipContent} from "@/types";
import {isValidElement} from "react";
import {Title} from "@/sketeton/component/title";
import classNames from "classnames";

export function composeTitle(title?: IPublicTypeTitleContent, icon?: IPublicTypeIconType, tip?: TipContent, tipAsTitle?: boolean, noIcon?: boolean) {
    if (!title) {
        title = {};
        if (!icon || tipAsTitle) {
            title.label = tip;
            tip = undefined;
        }
    }
    if (icon || tip) {
        if (typeof title !== 'object' || isValidElement(title)) {
            if (isValidElement(title)) {
                if (title.type === 'svg' || (title.type as any).getIcon) {
                    if (!icon) {
                        icon = title as any;
                    }
                    if (tipAsTitle) {
                        title = tip as any;
                        tip = null;
                    } else {
                        title = undefined;
                    }
                }
            }
            title = {
                label: title,
                icon,
                tip,
            };
        } else {
            title = {
                ...title,
                icon,
                tip,
            };
        }
    }
    // if (isTitleConfig(title) && noIcon) {
    //   if (!isValidElement(title)) {
    //     title.icon = undefined;
    //   }
    // }
    return title;
}
export function DockView({title, icon, description, size, className, onClick}: {
    [key: string]: any,
    className: string,
    onClick: () => void
}) {
    return (
        <Title title={composeTitle(title, icon, description)} className={classNames('lc-dock', className, {
            [`lc-dock-${size}`]: size,
        })}
               onClick={onClick}
        />
    );
}
