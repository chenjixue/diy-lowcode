import {
  Skeleton as InnerSkeleton,
} from '@/core/editor-skeleton';
const skeletonSymbol = Symbol('skeleton');
const innerSkeletonSymbol = Symbol('skeleton');
export class Skeleton implements IPublicApiSkeleton {
  private readonly [innerSkeletonSymbol]: InnerSkeleton;
  private readonly pluginName: string;

  get [skeletonSymbol](): InnerSkeleton {
    if (this.workspaceMode) {
      return this[innerSkeletonSymbol];
    }
    return this[innerSkeletonSymbol];
  }

  constructor(
      skeleton: InnerSkeleton,
      pluginName: string,
      readonly workspaceMode: boolean = false,
    ) {
    this[innerSkeletonSymbol] = skeleton;
    this.pluginName = pluginName;
  }

  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IPublicTypeSkeletonConfig) {
    const configWithName = {
      ...config,
      pluginName: this.pluginName,
    };
    return this[skeletonSymbol].add(configWithName);
  }
}

