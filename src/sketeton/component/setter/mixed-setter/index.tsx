import React, {Component, ComponentClass} from 'react';
import classNames from 'classnames';
// import './index.less';
import {SettingField} from '@/designer/setting/setting-field';
import {isSetterConfig} from "@/util/is-setter-config.ts";
import {observer} from "mobx-react";
import {common, setters} from "@/entry/entry.ts";
const {editorCabin} = common;
const {computed, createSetterContent} = editorCabin;

const {getSetter, getSettersMap} = setters;

export interface SetterItem {
    name: string;
    title: any;
    setter: any;
    props?: any;
    condition?: (field: SettingField) => boolean;
    initialValue?: any | ((field: SettingField) => any);
    list: boolean;
    valueType: string[];
}

const dash = '_';


export function isReactClass(obj) {
    return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}

export function isDynamicSetter(obj) {
    return obj && typeof obj === 'function' && !isReactClass(obj);
}

function getMixedSelect(field) {
    const path = field.path || [];
    if (path.length) {
        const key = `_unsafe_MixedSetter${dash}${path[path.length - 1]}${dash}select`
        const newPath = [...path];
        newPath.splice(path.length - 1, 1, key);
        const newKey = field.node.getPropValue(newPath.join('.'))
        if (newKey) return newKey;
        // 兼容下以前的问题情况，如果捕获到，获取 oldUnsafeKey 取值并将其直接置空
        const oldUnsafeKey = `_unsafe_MixedSetter${dash}${path.join(dash)}${dash}select`;
        const oldUsedSetter = field.node.getPropValue(oldUnsafeKey);
        if (oldUsedSetter) {
            field.node.setPropValue(newPath.join('.'), oldUsedSetter);
            field.node.setPropValue(oldUnsafeKey, undefined);
        }
        return oldUsedSetter;
    }
    return undefined;
}

function setMixedSelect(field, usedSetter) {
    const path = field.path || [];
    if (path.length) {
        const key = `_unsafe_MixedSetter${dash}${path[path.length - 1]}${dash}select`
        path.splice(path.length - 1, 1, key);
        field.node.setPropValue(path.join('.'), usedSetter)
    }
}

function nomalizeSetters(
    setters?: any,
): SetterItem[] {
    if (!setters) {
        const normalized: SetterItem[] = [];
        getSettersMap().forEach((setter, name) => {
            if (name === 'MixedSetter') {
                return;
            }
            normalized.push({
                name,
                title: setter.title || name,
                setter: name,
                condition: setter.condition,
                initialValue: setter.initialValue,
                list: setter.recommend || false,
                valueType: setter.valueType,
            });
        });

        return normalized;
    }
    const names: string[] = [];

    function generateName(n: string) {
        let idx = 1;
        let got = n;
        while (names.indexOf(got) > -1) {
            got = `${n}:${idx++}`;
        }
        names.push(got);
        return got;
    }

    const formattedSetters = setters.map((setter) => {
        const config: any = {
            setter,
            list: true,
        };
        if (isSetterConfig(setter)) {
            config.setter = setter.componentName;
            config.props = setter.props;
            config.condition = setter.condition;
            config.initialValue = setter.initialValue;
            config.title = setter.title;
            config.valueType = setter.valueType;
        }
        if (typeof config.setter === 'string') {
            config.name = config.setter;
            names.push(config.name);
            const info = getSetter(config.setter);
            if (!config.title) {
                config.title = info?.title || config.setter;
            }
            if (!config.valueType) {
                config.valueType = info?.valueType;
            }
            if (!config.condition) {
                config.condition = info?.condition;
            }
            if (!config.initialValue) {
                config.initialValue = info?.initialValue;
            }
        } else {
            config.name = generateName(
                (config.setter as any)?.displayName || (config.setter as any)?.name || 'CustomSetter',
            );
            if (!config.title) {
                config.title = config.name;
            }
        }
        return config;
    });
    const hasComplexSetter = formattedSetters.filter((item) =>
        ['ArraySetter', 'ObjectSetter'].includes(item.setter),
    ).length;
    return formattedSetters.map((item) => {
        if (item.setter === 'VariableSetter' && hasComplexSetter) {
            item.setter = 'ExpressionSetter';
            item.name = 'ExpressionSetter';
        }
        return item;
    });
}

interface VariableSetter extends ComponentClass {
    show(params: object): void;
}

@observer
export default class MixedSetter extends Component<{
    field: SettingField;
    setters?: Array<any>;
    onSetterChange?: (field: SettingField, name: string) => void;
    onChange?: (val: any) => void;
    value?: any;
    className?: string;
}> {

    private setters = nomalizeSetters(this.props.setters);
    // set name ,used in setting Transducer
    static displayName = 'MixedSetter';

    // private hasVariableSetter = this.setters.some((item) => item.name === 'VariableSetter');

    constructor(props) {
        super(props);
        // TODO: use engine ext.props
    }

    // @computed
   private getCurrentSetter() {
        const {field} = this.props;
        let firstMatched: SetterItem | undefined;
        let firstDefault: SetterItem | undefined;
        for (const setter of this.setters) {
            if (!setter.condition) {
                if (!firstDefault) {
                    firstDefault = setter;
                }
                continue;
            }
            if (!firstMatched && setter.condition(field)) {
                firstMatched = setter;
            }
        }
        return firstMatched || firstDefault || this.setters[0];
    }

    private renderCurrentSetter(currentSetter?: SetterItem, extraProps?: object) {
        const {className, field, setters, onSetterChange, ...restProps} = this.props;
        if (!currentSetter) {
            // TODO: use intl
            if (restProps.value == null) {
                return <span>NullValue</span>;
            } else {
                return <span>InvalidValue</span>;
            }
        }
        const {setter, props} = currentSetter;
        let setterProps: any = {};
        let setterType: any;
        setterType = setter;
        if (props) {
            setterProps = props;
        }

        return createSetterContent(setterType, {
            ...setterProps,
            field,
        });
    }

    private contentsFromPolyfill(setterComponent: VariableSetter) {
        const {field} = this.props;

        const n = this.setters.length;

        let setterContent: any;
        let actions: any;
        if (n < 3) {
            // FIXME! use variable placeholder setter
            const otherSetter = this.setters.find((item) => item.name !== 'VariableSetter')!;
            setterContent = this.renderCurrentSetter(otherSetter, {
                value: field.getMockOrValue(),
            });
        } else {
            // >=3: 原地展示当前 setter<当前绑定的值，点击调用 VariableSetter.show>，icon tip 提示绑定的值，点击展示切换 Setter，点击其它 setter 直接切换，点击 Variable Setter-> VariableSetter.show
            const currentSetter = this.getCurrentSetter();
            if (currentSetter?.name === 'VariableSetter') {
                setterContent = (
                    <a
                        onClick={() => {
                            setterComponent.show({prop: field});
                        }}
                    >
                        {`Binded: ${field.getValue()?.value ?? '-'}`}
                    </a>
                );
            } else {
                setterContent = this.renderCurrentSetter(currentSetter);
            }
        }

        return {
            setterContent,
        };
    }

    render() {
        const {className} = this.props;
        let contents: any
        // polyfill vision variable setter logic
        const setterComponent = getSetter('VariableSetter')?.component as any;
        if (setterComponent && setterComponent.isPopup) {
            contents = this.contentsFromPolyfill(setterComponent);
        }

        return (
            <div
                ref={(shell) => {
                    this.shell = shell;
                }}
                className={classNames('lc-setter-mixed', className)}
            >
                {contents.setterContent}
            </div>
        );
    }
}
