import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { Area } from '@/sketeton/area.ts';
import { Panel } from '@/sketeton/widget/pane.ts';
export default class BottomArea extends Component<{ area: Area<any, Panel> }> {
  render() {
    const { area } = this.props;
    if (area.isEmpty()) {
      return null;
    }
    return (
      <div className={classNames('lc-bottom-area', {
        'lc-area-visible': area.visible,
      })}
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
        {area.container.items.map((item) => item.content)}
      </Fragment>
    );
  }
}
