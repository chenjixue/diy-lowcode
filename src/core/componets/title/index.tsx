import { Component, isValidElement, ReactNode,ReactElement, ComponentType  } from 'react';
import classNames from 'classnames';
import { createIcon } from "./create-icon";
import './title.less';
import { IPublicTypeI18nData } from '@/core/plugin-manager';
import { observer } from 'mobx-react';
export interface IPublicTypeIconConfig {
  type: string;
  size?: number | 'small' | 'xxs' | 'xs' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl' | 'inherit';
  className?: string;
}
export type TipContent = string | IPublicTypeI18nData | ReactNode | IPublicTypeTipConfig;
export interface IPublicTypeTipConfig {
  className?: string;
  children?: IPublicTypeI18nData | ReactNode;
  theme?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}
export interface IPublicTypeTitleConfig {
  /**
   * 文字描述
   */
  label?:  IPublicTypeI18nData | ReactNode | string;
    /**
   * hover 后的展现内容
   */
  tip?: TipContent;
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
export interface IPublicTypeTitleProps {

  /**
   * 标题内容
   */
  title: IPublicTypeTitleContent;

  /**
   * className
   */
  className?: string;

  /**
   * 点击事件
   */
  onClick?: () => void;
  match?: boolean;
  keywords?: string;
}

export type IPublicTypeIconType = string | ReactElement | ComponentType<any> | IPublicTypeIconConfig;
export type IPublicTypeTitleContent = string |IPublicTypeI18nData| ReactNode|IPublicTypeTitleConfig;
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object';
}
export function isI18nData(obj: any): obj is IPublicTypeI18nData {
  if (!isObject(obj)) {
    return false;
  }
  return obj.type === 'i18n';
}
export function isPlainObject(value: any): value is any {
  if (!isObject(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null;
}
export function isTitleConfig(obj: any): obj is IPublicTypeTitleConfig {
  return isPlainObject(obj) && !isI18nData(obj);
}

@observer
export class Title extends Component<IPublicTypeTitleProps> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent) {
    const { title, onClick } = this.props;
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
    const { title, className } = this.props as IPublicTypeTitleProps;
    let _title: IPublicTypeTitleConfig;
    if (title == null) {
      return null;
    }
    if (isValidElement(title)) {
      return title;
    }
    if (isTitleConfig(title)) {
      _title = title;
    } else {
      _title = {
        label: title,
      };
    }

    const icon = _title.icon ? createIcon(_title.icon as ReactElement, { size: 20 }) : null;

    let tip: any = null;
    // if (_title.tip) {
    //   if (isValidElement(_title.tip) && _title.tip.type === Tip) {
    //     tip = _title.tip;
    //   } else {
    //     const tipProps =
    //       typeof _title.tip === 'object' && !(isValidElement(_title.tip) || isI18nData(_title.tip))
    //         ? _title.tip
    //         : { children: _title.tip };
    //     tip = <Tip {...tipProps} />;
    //   }
    // }
    return (
      <span
        className={classNames('lc-title', className, (title as IPublicTypeTitleConfig).className, {
          'has-tip': !!tip,
          'only-icon': !(title as IPublicTypeTitleConfig).label,
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
