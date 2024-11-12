import classNames from 'classnames';
import { Component, Fragment, isValidElement } from 'react';
import { Title } from './title';
import Icon, {
    CloseOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react';
import { action, makeObservable } from 'mobx';
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

@observer
export class TitledPanelView extends Component<{ panel: Panel; area?: string }> {
    //   private lastVisible = false;

    //   componentDidMount() {
    //     this.checkVisible();
    //   }

    //   componentDidUpdate() {
    //     this.checkVisible();
    //   }

    //   checkVisible() {
    //     const { panel } = this.props;
    //     const currentVisible = panel.inited && panel.visible;
    //     if (currentVisible !== this.lastVisible) {
    //       this.lastVisible = currentVisible;
    //       if (this.lastVisible) {
    //         panel.skeleton.postEvent(SkeletonEvents.PANEL_SHOW, panel.name, panel);
    //       } else {
    //         panel.skeleton.postEvent(SkeletonEvents.PANEL_HIDE, panel.name, panel);
    //       }
    //     }
    //   }

    render() {
        const { panel, area } = this.props;
        // if (!panel.inited) {
        //   return null;
        // }
        // const editor = panel.skeleton.editor;
        const panelName = area ? `${area}-${panel.name}` : panel.name;
        // editor?.eventBus.emit('skeleton.panel.toggle', {
        //   name: panelName || '',
        //   status: panel.visible ? 'show' : 'hide',
        // });
        return (
            <div
                className={classNames('lc-titled-panel', {
                    hidden: !panel.visible,
                })}
                id={panelName}
                data-keep-visible-while-dragging={panel.config.props?.keepVisibleWhileDragging}
            >
                <PanelOperationRow panel={panel} />
                <PanelTitle panel={panel} />
                {/* <div className="lc-panel-body">{panel.body}</div>
        <DraggableLineView panel={panel} /> */}
            </div>
        );
    }
}
const FloatSvg = () => (
    <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" width="13" height="13" viewBox="0 0 1024 1024"><path d="M750.848 28.928l245.248 242.944a66.048 66.048 0 1 1-93.184 93.184l-25.6-19.456-249.6 353.792 78.336 78.336a66.048 66.048 0 0 1-93.184 92.672l-460.8-464.64a66.048 66.048 0 0 1 93.184-93.184l76.8 78.336 354.048-249.856-18.176-18.944a66.048 66.048 0 1 1 93.184-93.184zM380.672 732.416l-91.904-90.88c-74.24 89.6-191.488 219.904-212.736 247.04a419.84 419.84 0 0 0-70.656 128 419.84 419.84 0 0 0 128-70.144c27.136-21.248 157.44-138.496 246.528-214.016z"></path></svg>
);

const FixSvg = () => (
    <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" width="16" height="16" viewBox="0 0 1024 1024"><path d="M160.256 816.64C116.224 872.448 102.4 921.6 102.4 921.6s49.152-13.824 104.96-57.856c22.016-17.408 128-112.64 200.704-174.08l-73.728-73.728c-61.44 72.704-157.184 178.688-174.08 200.704zM648.704 209.408L442.368 355.328l226.304 226.304 145.92-206.336 15.872 15.872c20.992 20.992 54.784 20.992 75.776 0s20.992-54.784 0-75.776l-197.12-197.12c-20.992-20.992-54.784-20.992-75.776 0-20.992 20.992-20.992 54.784 0 75.776l15.36 15.36zM247.808 334.848c-9.728 2.048-18.944 6.656-26.624 14.336-20.992 20.992-20.992 54.784 0 75.776l377.856 377.856c20.992 20.992 54.784 20.992 75.776 0 7.68-7.68 12.288-16.896 14.336-26.624L247.808 334.848z"></path><path d="M840.704 879.104c-9.728 0-19.456-3.584-27.136-11.264L155.648 210.432c-14.848-14.848-14.848-39.424 0-54.272 14.848-14.848 39.424-14.848 54.272 0L867.84 814.08c14.848 14.848 14.848 39.424 0 54.272-7.168 7.168-16.896 10.752-27.136 10.752z"></path></svg>
);
const IconFix = (props:any)=>(
    <Icon component={FixSvg} {...props} />
)
const IconFloat =(props:any)=>(
    <Icon component={FloatSvg} {...props} />
)
@observer
class PanelTitle extends Component<{ panel: Panel; className?: string }> {
  render() {
    const { panel, className } = this.props;
    return (
      <div
        className={classNames('lc-panel-title', className, {
          actived: panel.actived,
        })}
        data-name={panel.name}
      >
        <Title title={panel.title || panel.name} />
        {/* {panel.help ? <HelpTip help={panel.help} /> : null} */}
      </div>
    );
  }
}

export default class PanelOperationRow extends Component<{ panel: Panel }> {
    constructor(props) {
        super(props);
        makeObservable(this);
    }
    // fix or float
    @action
    setDisplay() {
        const { panel } = this.props;
        const current = panel;
        if (!current) {
            return;
        }

        panel.skeleton.toggleFloatStatus(panel);
    }

    render() {
        const { panel } = this.props;
        const areaName = panel?.parent?.name;
        const area = panel.skeleton[areaName];
        return (
            <Fragment>
                {(
                    <Fragment>
                        {(
                            <div  className="lc-pane-icon-fix" onClick={this.setDisplay.bind(this)}>
                                {areaName === 'leftFloatArea' ? <IconFix /> : <IconFloat />}
                            </div>
                        )}
                        <div
                          
                            className="lc-pane-icon-close"
                            onClick={() => {
                                area && area.setVisible(false);
                            }}
                        >
                            <CloseOutlined />
                        </div>
                    </Fragment>
                )}
            </Fragment>
        );
    }
}
