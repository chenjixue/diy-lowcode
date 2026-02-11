import {observer} from "mobx-react";
import {Component, ReactNode, createElement, ReactElement} from "react";
import {SkeletonContext} from "@/sketeton/context/context.ts";
import {observable} from "mobx";
import {SettingField} from "@/designer/setting/setting-field.ts";
import SettingFieldView from "@/designer/setting/setting-field-view.tsx";

interface SettingsPaneProps {
    target?: any
}

export class Field extends Component<{ children: ReactElement }> {
    private body: HTMLDivElement | null = null;

    render() {
        const {children} = this.props;
        const id = ''
        return (
            <div id={id}>
                <div key="body" ref={(shell) => {
                    this.body = shell;
                }} className="lc-field-body">
                    {children}
                </div>
            </div>
        )
    }
}

export function createField(props: any, children: ReactNode): ReactNode {
    return createElement(Field, {...props}, children);
}


@observer
export class SettingsPane extends Component<SettingsPaneProps> {
    static contextType = SkeletonContext;

    @observable private currentStage?;


    private handleClick = (e: MouseEvent) => {
        // compatiable vision stageBox
        // TODO: optimize these codes
        // const { usePopup = true } = this.props;
        // if (!usePopup) return;
        // const pane = e.currentTarget as HTMLDivElement;
        // function getTarget(node: any): any {
        //     if (!pane.contains(node) || (node.nodeName === 'A' && node.getAttribute('href'))) {
        //         return null;
        //     }
        //
        //     const target = node.dataset ? node.dataset.stageTarget : null;
        //     if (target) {
        //         return target;
        //     }
        //     return getTarget(node.parentNode);
        // }
        // const target = getTarget(e.target);
        // if (!target) {
        //     return;
        // }
        //
        // const skeleton = this.context as Skeleton;
        // if (!skeleton || !skeleton.stages) {
        //     return;
        // }
        // const stage = skeleton.stages.container.get(target);
        // if (stage) {
        //     if (this.currentStage) {
        //         stage.setPrevious(this.currentStage);
        //     }
        //     this.currentStage = stage;
        // }
    };

    // private popStage() {
    //     this.currentStage = this.currentStage?.getPrevious();
    // }

    render() {
        const {target} = this.props;
        const {items} = target;

        return (
            <div className="lc-settings-pane" onClick={this.handleClick}>
                {/* todo: add head for single use */}
                <div className="lc-settings-content">
                    {items.map((item, index) => createSettingFieldView(item))}
                </div>
            </div>
        );
    }
}

export function createSettingFieldView(field: SettingField) {
    return <SettingFieldView field={field} key={field.id} />;
}
