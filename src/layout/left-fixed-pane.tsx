import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { Area } from '@/core/area';
import { observer } from 'mobx-react';

@observer
export default class LeftFixedPane extends Component<{ area: Area<PanelConfig, Panel> }> {
  componentDidUpdate() {
    // FIXME: dirty fix, need deep think
  }


  render() {
    const { area } = this.props;
    const width = area.current?.config.props?.width;
    const style = width
      ? {
        width,
      }
      : undefined;

    return (
      <div
        className={classNames('lc-left-fixed-pane', {
          'lc-area-visible': area.visible,
        })}
        style={style}
      >
        <Contents area={area} />
      </div>
    );
  }
}

class Contents extends Component<{ area: Area<PanelConfig, Panel> }> {
  render() {
    const { area } = this.props;
    return <Fragment>{area.container.items.map((panel) => panel.content)}</Fragment>;
  }
}
