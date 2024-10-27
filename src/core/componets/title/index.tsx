import { Component, isValidElement, ReactNode,ReactElement, ComponentType  } from 'react';
import classNames from 'classnames';
import { createIcon } from "./create-icon";
import './title.less';
export interface IPublicTypeIconConfig {
  type: string;
  size?: number | 'small' | 'xxs' | 'xs' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl' | 'inherit';
  className?: string;
}
export interface IPublicTypeTitleConfig {
  /**
   * 文字描述
   */
  label?:  ReactNode;
  /**
   * 文档链接，暂未实现
   */
  docUrl?: string;
  /**
   * 图标
   */
  icon?: IPublicTypeIconType;
  /**
   * CSS 类
   */
  className?: string;
}

export type IPublicTypeIconType = string | ReactElement | ComponentType<any> | IPublicTypeIconConfig;
export type IPublicTypeTitleContent = string | ReactElement | IPublicTypeTitleConfig;
export class Title extends Component<{
  title: IPublicTypeTitleContent;
  className?: string;
  onClick?: () => void;
  match?: boolean;
  keywords?: string;
}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent) {
    const { title, onClick } = this.props as any;
    const url = title && (title.docUrl || title.url);
    if (url) {
      window.open(url);
      // 防止触发行操作（如折叠面板）
      e.stopPropagation();
    }
    // TODO: 操作交互冲突，目前 mixedSetter 仅有 2 个 setter 注册时用到了 onClick
    onClick && onClick(e);
  }
  render() {
    // eslint-disable-next-line prefer-const
    let { title, className } = this.props;
    if (title == null) {
      return null;
    }
    if (isValidElement(title)) {
      return title;
    }
    if (typeof title === 'string') {
      title = { label: title };
    }

    const icon = title.icon ? createIcon(title.icon, { size: 20 }) : null;

    let tip: any = null;
    return (
      <span
        className={classNames('lc-title', className, title.className, {
          'has-tip': !!tip,
          'only-icon': !title.label,
        })}
        onClick={this.handleClick}
      >
        {icon ? <b className="lc-title-icon">{icon}</b> : null}
        {/* {this.renderLabel(title.label)} */}
        {/* {tip} */}
      </span>
    );
  }
}
