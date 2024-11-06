import classNames from 'classnames';
import { Component, ReactElement, isValidElement } from 'react';
import { Title } from './title';
import { divide } from 'lodash';
import { observer } from 'mobx-react';
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

export function DockView({ title, icon, description, size, className, onClick }) {
    return (
        <Title title={composeTitle(title, icon, description)} className={classNames('lc-dock', className, {
            [`lc-dock-${size}`]: size,
        })}
        onClick={onClick}
        />
    );
}
export class WidgetView extends Component<{ widget: IWidget }> {
    componentDidMount() {
    //   this.checkVisible();
    //   this.checkDisabled();
    }
  
    componentDidUpdate() {
    //   this.checkVisible();
    //   this.checkDisabled();
    }
  
    private lastVisible = false;
    private lastDisabled = false;
  
    // checkVisible() {
    //   const { widget } = this.props;
    //   const currentVisible = widget.visible;
    //   if (currentVisible !== this.lastVisible) {
    //     this.lastVisible = currentVisible;
    //     if (this.lastVisible) {
    //       widget.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, widget.name, widget);
    //     } else {
    //       widget.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, widget.name, widget);
    //     }
    //   }
    // }
  
    // checkDisabled() {
    //   const { widget } = this.props;
    //   const currentDisabled = widget.disabled;
    //   if (currentDisabled !== this.lastDisabled) {
    //     this.lastDisabled = currentDisabled;
    //     if (this.lastDisabled) {
    //       widget.skeleton.postEvent(SkeletonEvents.WIDGET_DISABLE, widget.name, widget);
    //     } else {
    //       widget.skeleton.postEvent(SkeletonEvents.WIDGET_ENABLE, widget.name, widget);
    //     }
    //   }
    // }
  
    render() {
      const { widget } = this.props;
    //   if (!widget.visible) {
    //     return null;
    //   }
      if (widget.disabled) {
        return <div className="lc-widget-disabled">{widget.body}</div>;
      }
      return widget.body;
    }
  }
@observer
export class PanelDockView extends Component<DockProps & { dock: PanelDock }> {
    componentDidMount() {
        //   this.checkActived();
    }

    componentDidUpdate() {
        //   this.checkActived();
    }
    private lastActived = false;

    // checkActived() {
    //   const { dock } = this.props;
    //   if (dock.actived !== this.lastActived) {
    //     this.lastActived = dock.actived;
    //     if (this.lastActived) {
    //       dock.skeleton.postEvent(SkeletonEvents.PANEL_DOCK_ACTIVE, dock.name, dock);
    //     } else {
    //       dock.skeleton.postEvent(SkeletonEvents.PANEL_DOCK_UNACTIVE, dock.name, dock);
    //     }
    //   }
    // }

    render() {
        const { dock, className, onClick, ...props } = this.props;
          return DockView({
            ...props,
            className: classNames(className, {
              actived: dock.actived,
            }),
            onClick: () => {
              onClick && onClick();
              dock.togglePanel();
            },
          });
    }
}