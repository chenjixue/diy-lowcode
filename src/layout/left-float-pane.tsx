import { Component, Fragment } from 'react'
import { observer } from "mobx-react";
import classNames from 'classnames';
import { Area } from '@/core/area';
@observer
export default class LeftFloatPane  extends Component<{ area: Area<any, Panel> }> {
  render() {
    const { area } = this.props;
    return (
      <div
        // ref={(ref) => { this.shell = ref; }}
        className={classNames('lc-left-float-pane', {
          'lc-area-visible': area.visible,
        })}
        // style={style}
      >
         <Contents area={area} />
      </div>
    );
  }
}

class Contents extends Component<{ area: Area<any, Panel> }> {
  render() {
    const { area } = this.props;
    return (
      <Fragment>
        {area.container.items.map((panel) => panel.content)}
      </Fragment>
    );
  }
}
