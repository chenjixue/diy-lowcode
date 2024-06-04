import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { Area } from '@/core/area';
export default class RightArea extends Component<{ area: Area<any, Panel> }> {
  render() {
    const { area } = this.props;
    if (area.isEmpty()) {
      return null;
    }
    return (
      <div className={classNames('lc-right-area engine-tabpane', {
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
