import classNames from 'classnames';
import {Component, Fragment, isValidElement} from 'react';
import {Title} from '@/sketeton/component/title';
import Icon, {
    CloseOutlined
} from '@ant-design/icons';
import {observer} from 'mobx-react';
import {action, makeObservable} from 'mobx';
import {IPublicTypeIconType, IPublicTypeTitleContent, TipContent} from "@/types";
import {IWidget} from "@/sketeton/widget/widget.ts";

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
        const {widget} = this.props;
        //   if (!widget.visible) {
        //     return null;
        //   }
        if (widget.disabled) {
            return <div className="lc-widget-disabled">{widget.body}</div>;
        }
        return widget.body;
    }
}
