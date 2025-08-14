import { Component } from 'react';
import React from 'react';
import classNames from 'classnames';
import { Area } from '@/core/area';
import { observer } from "mobx-react";
console.log(React,"react--")
@observer
export default class MainArea extends Component<{ area: Area<any, Panel | Widget> }> {
  render() {
    const { area } = this.props;
    return (
      <div className={classNames('lc-main-area engine-workspacepane')}>
        {area.container.items.map((item) => item.content)}
      </div>
    );
  }
}
