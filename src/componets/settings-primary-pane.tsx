import React, { Component } from 'react';
export class SettingsPrimaryPane extends Component<any, any> {
  constructor(props:any) {
    super(props);
  }
  render() {
    return (
      <div className="lc-settings-main">
        <div className="lc-settings-notice">
          <p>请在左侧画布中选中节点</p>
        </div>
      </div>
    );
  }
}

