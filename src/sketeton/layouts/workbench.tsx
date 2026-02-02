import { Component } from 'react';
// import { TipContainer, observer } from '@alilc/lowcode-editor-core';
import classNames from 'classnames';
import { Skeleton } from '@/sketeton/skeleton.ts';
import LeftArea from '@/sketeton/layouts/left-area.tsx';
import LeftFixedPane from '@/sketeton/layouts/left-fixed-pane.tsx';
import LeftFloatPane from '@/sketeton/layouts/left-float-pane.tsx';
import MainArea from '@/sketeton/layouts/main-area.tsx';
import RightArea from '@/sketeton/layouts/right-area.tsx';
import './workbench.less';
import { SkeletonContext } from '@/sketeton/context/context.ts';



export class Workbench extends Component<{
  skeleton: Skeleton;
  config?: any;
  components?: any;
  className?: string;
  topAreaItemClassName?: string;
}> {
  constructor(props: any) {
    super(props);
    const { config, components, skeleton } = this.props;
    // skeleton.buildFromConfig(config, components);
  }

  render() {
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
              {/* <Toolbar area={skeleton.toolbar} /> */}
              <MainArea area={skeleton.mainArea} />
              {/* <BottomArea area={skeleton.bottomArea} /> */}
            </div>
             <RightArea area={skeleton.rightArea} />
          </div>
          {/* <TipContainer /> */}
        </SkeletonContext.Provider>
      </div>
    );
  }
}
