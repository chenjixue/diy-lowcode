import {Component} from "react";
import {observer} from "mobx-react";
import {Panel} from "@/sketeton/widget/pane.ts";
import classNames from "classnames";

function PanelOperationRow(props: { panel: Panel }) {
    return null;
}

function DraggableLineView(props: { panel: Panel }) {
    return null;
}

@observer
export class PanelView extends Component<{
    panel: Panel;
    area?: string;
    hideOperationRow?: boolean;
    hideDragLine?: boolean;
}> {
    private lastVisible = false;

    componentDidMount() {
        // this.checkVisible();
    }

    componentDidUpdate() {
        // this.checkVisible();
    }

    // checkVisible() {
    //     const { panel } = this.props;
    //     const currentVisible = panel.inited && panel.visible;
    //     if (currentVisible !== this.lastVisible) {
    //         this.lastVisible = currentVisible;
    //         if (this.lastVisible) {
    //             panel.skeleton.postEvent(SkeletonEvents.PANEL_SHOW, panel.name, panel);
    //         } else {
    //             panel.skeleton.postEvent(SkeletonEvents.PANEL_HIDE, panel.name, panel);
    //         }
    //     }
    // }

    render() {
        const { panel, area, hideOperationRow, hideDragLine } = this.props;
        if (!panel.inited) {
            return null;
        }
        // const editor = panel.skeleton.editor;
        const panelName = area ? `${area}-${panel.name}` : panel.name;
        // editor?.eventBus.emit('skeleton.panel.toggle', {
        //     name: panelName || '',
        //     status: panel.visible ? 'show' : 'hide',
        // });
        return (
            <div
                className={classNames('lc-panel', {
                    hidden: !panel.visible,
                })}
                id={panelName}
                data-keep-visible-while-dragging={panel.config.props?.keepVisibleWhileDragging}
            >
                {!hideOperationRow && <PanelOperationRow panel={panel} />}
                {panel.body}
                {/*{!hideDragLine && <DraggableLineView panel={panel} />}*/}
            </div>
        );
    }
}
