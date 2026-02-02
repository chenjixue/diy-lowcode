import {
    IPublicTypeArrayOf,
    IPublicTypeFieldConfig, IPublicTypeObjectOf,
    IPublicTypeOneOf, IPublicTypeOneOfType,
    IPublicTypePropConfig,
} from "@/types";

interface Isetter {
    componentName: string;
    isRequired: boolean | undefined;
    initialValue: any
}

export function propConfigToFieldConfig(propConfig: IPublicTypePropConfig): IPublicTypeFieldConfig {
    const {name, description} = propConfig;
    const title = {
        label: {type: 'i18n', 'en-US': name, 'zh-CN': description?.slice(0, 10) || name,},
        tip: description ? `${name} | ${description}` : undefined
    };
    return {
        title,
        ...propConfig,
        setter: propConfig.setter ? propConfig.setter : propTypeToSetter(propConfig.propType)
    };
}

export function propTypeToSetter(propType): Isetter {
    let typeName: string;
    let isRequired: boolean | undefined = false;
    if (typeof propType === 'string') {
        typeName = propType;
    } else if (typeof propType === 'object') {
        typeName = propType.type;
        isRequired = propType.isRequired;
    } else {
        typeName = 'string';
    }
    // TODO: use mixinSetter wrapper
    switch (typeName) {
        case 'string':
            return {
                componentName: 'StringSetter',
                isRequired,
                initialValue: '',
            };
        case 'number':
            return {
                componentName: 'NumberSetter',
                isRequired,
                initialValue: 0,
            };
        case 'bool':
            return {
                componentName: 'BoolSetter',
                isRequired,
                initialValue: false,
            };
        case 'oneOf':
            const dataSource = ((propType as IPublicTypeOneOf).value || []).map((value, index) => {
                const t = typeof value;
                return {
                    label: t === 'string' || t === 'number' || t === 'boolean' ? String(value) : `value ${index}`,
                    value,
                };
            });
            const componentName = dataSource.length >= 4 ? 'SelectSetter' : 'RadioGroupSetter';
            return {
                componentName,
                props: {dataSource, options: dataSource},
                isRequired,
                initialValue: dataSource[0] ? dataSource[0].value : null,
            };

        case 'element':
        case 'node': // TODO: use Mixin
            return {
                // slotSetter
                componentName: 'SlotSetter',
                props: {
                    mode: typeName,
                },
                isRequired,
                initialValue: {
                    type: 'JSSlot',
                    value: [],
                },
            };
        case 'shape':
        case 'exact':
            const items = ((propType as any).value || []).map((item: any) => propConfigToFieldConfig(item));
            return {
                componentName: 'ObjectSetter',
                props: {
                    config: {
                        items,
                        extraSetter: typeName === 'shape' ? propTypeToSetter('any') : null,
                    },
                },
                isRequired,
                initialValue: (field) => {
                    const data: any = {};
                    items.forEach((item: any) => {
                        let initial = item.defaultValue;
                        if (initial == null && item.setter && typeof item.setter === 'object') {
                            initial = (item.setter as any).initialValue;
                        }
                        data[item.name] = initial ? (typeof initial === 'function' ? initial(field) : initial) : null;
                    });
                    return data;
                },
            };
        case 'object':
        case 'objectOf':
            return {
                componentName: 'ObjectSetter',
                props: {
                    config: {
                        extraSetter: propTypeToSetter(typeName === 'objectOf' ? (propType as IPublicTypeObjectOf).value : 'any'),
                    },
                },
                isRequired,
                initialValue: {},
            };
        case 'array':
        case 'arrayOf':
            return {
                componentName: 'ArraySetter',
                props: {
                    itemSetter: propTypeToSetter(typeName === 'arrayOf' ? (propType as IPublicTypeArrayOf).value : 'any'),
                },
                isRequired,
                initialValue: [],
            };
        case 'func':
            return {
                componentName: 'FunctionSetter',
                isRequired,
            };
        case 'color':
            return {
                componentName: 'ColorSetter',
                isRequired,
            };
        case 'oneOfType':
            return {
                componentName: 'MixedSetter',
                props: {
                    // TODO:
                    setters: (propType as IPublicTypeOneOfType).value.map((item) => propTypeToSetter(item)),
                },
                isRequired,
            };
        default:
        // do nothing
    }
    return {
        componentName: 'MixedSetter',
        isRequired,
        props: {},
    };
}
