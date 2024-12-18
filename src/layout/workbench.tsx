import { Component } from 'react';
// import { TipContainer, observer } from '@alilc/lowcode-editor-core';
import classNames from 'classnames';
import { Skeleton } from '@/core/editor-skeleton';
import TopArea from '@/layout/top-area';
import LeftArea from '@/layout/left-area';
import LeftFixedPane from '@/layout/left-fixed-pane';
import LeftFloatPane from '@/layout/left-float-pane';
import Toolbar from '@/layout/toolbar';
import MainArea from '@/layout/main-area';
import BottomArea from '@/layout/bottom-area';
import RightArea from '@/layout/right-area';
import './workbench.less';
import { SkeletonContext } from '@/layout/context/context';
export class Workbench extends Component<{
  skeleton: Skeleton;
  config?: EditorConfig;
  components?: PluginClassSet;
  className?: string;
  topAreaItemClassName?: string;
}> {
  constructor(props: any) {
    super(props);
    const { config, components, skeleton } = this.props;
    // skeleton.buildFromConfig(config, components);
  }
  
  render() {
    console.log("测试包111ss")
    const {
      skeleton,
      className,
      topAreaItemClassName,
    } = this.props;
    return (
      <div className={classNames('lc-workbench', className)}>
        <SkeletonContext.Provider value={this.props.skeleton}>
          {/* <TopArea area={skeleton.topArea} itemClassName={topAreaItemClassName} /> */}
          <div className="lc-workbench-body">
            <LeftArea area={skeleton.leftArea} />
            <LeftFloatPane area={skeleton.leftFloatArea} />
            <LeftFixedPane area={skeleton.leftFixedArea} />
            <div className="lc-workbench-center">
              {/* <Toolbar area={skeleton.toolbar} />
              <MainArea area={skeleton.mainArea} />
              <BottomArea area={skeleton.bottomArea} /> */}
            </div>
            {/* <RightArea area={skeleton.rightArea} /> */}
          </div>
          {/* <TipContainer /> */}
        </SkeletonContext.Provider>
      </div>
    );
  }
}
