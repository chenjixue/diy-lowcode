import {observer} from "mobx-react";
import {Component} from "react";
import classNames from "classnames";
import {PanelDock} from "@/sketeton/widget/panel-dock.ts";
import {DockView} from "@/sketeton/widget/dock-view.tsx";

@observer
export class PanelDockView extends Component<{ dock: PanelDock, className: string, onClick: () => void }> {
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
        const {dock, className, onClick, ...props} = this.props;
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
