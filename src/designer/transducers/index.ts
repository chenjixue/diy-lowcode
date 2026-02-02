import {ConfigureSupportEvent, IPublicTypeFieldConfig, IPublicTypeTransformedComponentMetadata} from "@/types";
import {propConfigToFieldConfig} from "@/designer/transducers/utils.ts";

const EVENT_RE = /^on|after|before[A-Z][\w]*$/;


export function componentDefaults(metadata) {
    const {configure, componentName} = metadata;
    const {component = {}} = configure;
    if (!component.nestingRule) {
        let m;
        // uri match xx.Group set subcontrolling: true, childWhiteList
        // eslint-disable-next-line no-cond-assign
        if ((m = /^(.+)\.Group$/.exec(componentName))) {
            // component.subControlling = true;
            component.nestingRule = {
                childWhitelist: [`${m[1]}`],
            };
            // eslint-disable-next-line no-cond-assign
        } else if ((m = /^(.+)\.Node$/.exec(componentName))) {
            // uri match xx.Node set selfControlled: false, parentWhiteList
            // component.selfControlled = false;
            component.nestingRule = {
                parentWhitelist: [`${m[1]}`, componentName],
            };
            // eslint-disable-next-line no-cond-assign
        } else if ((m = /^(.+)\.(Item|Node|Option)$/.exec(componentName))) {
            // uri match .Item .Node .Option set parentWhiteList
            component.nestingRule = {
                parentWhitelist: [`${m[1]}`],
            };
        }
    }
    return {
        ...metadata,
        configure: {
            ...configure,
            component,
        },
    };
}


export function parseProps(metadata: IPublicTypeTransformedComponentMetadata): IPublicTypeTransformedComponentMetadata {
    const {configure = {}} = metadata;
    // TODO types后续补充
    let extendsProps: any = null;
    if (configure.props) {
        if (Array.isArray(configure.props)) {
            return metadata;
        }
        const {isExtends, override = []} = configure.props;
        // 不开启继承时，直接返回configure配置
        if (!isExtends) {
            return {
                ...metadata,
                configure: {
                    ...configure,
                    props: [...override],
                },
            };
        }

        extendsProps = {};
        // 开启继承后，缓存重写内容的配置
        override.forEach((prop: any) => {
            extendsProps[prop.name] = prop;
        });
    }

    if (!metadata.props) {
        return {
            ...metadata,
            configure: {
                ...configure,
                props: [],
            },
        };
    }
    const {component = {}, supports = {}} = configure;
    const supportedEvents: ConfigureSupportEvent[] | null = supports.events ? null : [];
    const props: IPublicTypeFieldConfig[] = [];

    metadata.props.forEach((prop) => {
        const {name, propType, description} = prop;
        if (
            name === 'children' &&
            (component.isContainer || propType === 'node' || propType === 'element' || propType === 'any')
        ) {
            if (component.isContainer !== false) {
                component.isContainer = true;
                props.push(propConfigToFieldConfig(prop));
                return;
            }
        }

        if (EVENT_RE.test(name) && (propType === 'func' || propType === 'any')) {
            if (supportedEvents) {
                supportedEvents.push({
                    name,
                    description,
                });
                supports.events = supportedEvents;
            }
            return;
        }

        if (name === 'className' && (propType === 'string' || propType === 'any')) {
            if (supports.className == null) {
                supports.className = true;
            }
            return;
        }

        if (name === 'style' && (propType === 'object' || propType === 'any')) {
            if (supports.style == null) {
                supports.style = true;
            }
            return;
        }

        // 存在覆盖配置时
        if (extendsProps) {
            if (name in extendsProps) {
                prop = extendsProps[name];
            }
        }

        props.push(propConfigToFieldConfig(prop));
    });

    return {
        ...metadata,
        configure: {
            ...configure,
            props,
            supports,
            component,
        },
    };
}


export function addonCombine(
    metadata: IPublicTypeTransformedComponentMetadata,
): IPublicTypeTransformedComponentMetadata {
    const {componentName, configure = {}} = metadata;

    // 如果已经处理过，不再重新执行一遍
    if (configure.combined) {
        return metadata;
    }
    if (componentName === 'Leaf') {
        return {
            ...metadata,
            configure: {
                ...configure,
                combined: [
                    {
                        name: 'children',
                        title: {type: 'i18n', 'zh-CN': '内容设置', 'en-US': 'Content'},
                        setter: {
                            componentName: 'MixedSetter',
                            props: {
                                // TODO:
                                setters: [
                                    {
                                        componentName: 'StringSetter',
                                        props: {
                                            // TODO: textarea mode
                                            multiline: true,
                                        },
                                        initialValue: '',
                                    },
                                    {
                                        componentName: 'ExpressionSetter',
                                        initialValue: {
                                            type: 'JSExpression',
                                            value: '',
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        };
    }

    const {props, supports = {}} = configure as any;
    const isRoot: boolean = componentName === 'Page' || componentName === 'Component';
    const eventsDefinition: any[] = [];
    const supportedLifecycles =
        supports.lifecycles ||
        (isRoot
            ? /* [
          {
            description: '初始化时',
            name: 'constructor',
          },
          {
            description: '装载后',
            name: 'componentDidMount',
          },
          {
            description: '更新时',
            name: 'componentDidUpdate',
          },
          {
            description: '卸载时',
            name: 'componentWillUnmount',
          },
        ] */ null
            : null);
    if (supportedLifecycles) {
        eventsDefinition.push({
            type: 'lifeCycleEvent',
            title: '生命周期',
            list: supportedLifecycles.map((event: any) => (typeof event === 'string' ? {name: event} : event)),
        });
    }
    if (supports.events) {
        eventsDefinition.push({
            type: 'events',
            title: '事件',
            list: (supports.events || []).map((event: any) => (typeof event === 'string' ? {name: event} : event)),
        });
    }
    //  通用设置
    let propsGroup = props ? [...props] : [];
    const basicInfo: any = {};
    if (componentName === 'Slot') {
        if (!configure.component) {
            configure.component = {
                isContainer: true,
            };
        } else if (typeof configure.component === 'object') {
            configure.component.isContainer = true;
        }
        // basicInfo.icon = IconSlot;
        basicInfo.icon = null
        propsGroup = [
            {
                name: 'slotTitle',
                title: {
                    type: 'i18n',
                    'en-US': 'Slot Title',
                    'zh-CN': '插槽标题',
                },
                setter: 'StringSetter',
                defaultValue: '插槽容器',
            },
        ];
    }
    // propsGroup.push({
    //   name: '#generals',
    //   title: { type: 'i18n', 'zh-CN': '通用', 'en-US': 'General' },
    //   items: [
    //     {
    //       name: 'id',
    //       title: 'ID',
    //       setter: 'StringSetter',
    //     },
    //     {
    //       name: 'key',
    //       title: 'Key',
    //       // todo: use Mixin
    //       setter: 'StringSetter',
    //     },
    //     {
    //       name: 'ref',
    //       title: 'Ref',
    //       setter: 'StringSetter',
    //     },
    //     {
    //       name: '!more',
    //       title: '更多',
    //       setter: 'PropertiesSetter',
    //     },
    //   ],
    // });
    const stylesGroup: IPublicTypeFieldConfig[] = [];
    const advancedGroup: IPublicTypeFieldConfig[] = [];
    if (propsGroup) {
        let l = propsGroup.length;
        while (l-- > 0) {
            const item = propsGroup[l];
            // if (item.type === 'group' && (item.title === '高级' || item.title?.label === '高级')) {
            //   advancedGroup = item.items || [];
            //   propsGroup.splice(l, 1);
            // }
            if (
                item.name === '__style__' ||
                item.name === 'style' ||
                item.name === 'containerStyle' ||
                item.name === 'pageStyle'
            ) {
                propsGroup.splice(l, 1);
                stylesGroup.push(item);
                if (item.extraProps?.defaultCollapsed && item.name !== 'containerStyle') {
                    item.extraProps.defaultCollapsed = false;
                }
            }
        }
    }
    const combined: IPublicTypeFieldConfig[] = [
        {
            title: {type: 'i18n', 'zh-CN': '属性', 'en-US': 'Props'},
            name: '#props',
            items: propsGroup,
        },
    ];
    if (supports.className) {
        stylesGroup.push({
            name: 'className',
            title: {type: 'i18n', 'zh-CN': '类名绑定', 'en-US': 'ClassName'},
            setter: 'ClassNameSetter',
        });
    }
    if (supports.style) {
        stylesGroup.push({
            name: 'style',
            title: {type: 'i18n', 'zh-CN': '行内样式', 'en-US': 'Style'},
            setter: 'StyleSetter',
            extraProps: {
                display: 'block',
            },
        });
    }
    if (stylesGroup.length > 0) {
        combined.push({
            name: '#styles',
            title: {type: 'i18n', 'zh-CN': '样式', 'en-US': 'Styles'},
            items: stylesGroup,
        });
    }

    if (eventsDefinition.length > 0) {
        combined.push({
            name: '#events',
            title: {type: 'i18n', 'zh-CN': '事件', 'en-US': 'Events'},
            items: [
                {
                    name: '__events',
                    title: {type: 'i18n', 'zh-CN': '事件设置', 'en-US': 'Events'},
                    setter: {
                        componentName: 'EventsSetter',
                        props: {
                            definition: eventsDefinition,
                        },
                    },
                    getValue(field, val?: any[]) {
                        return val;
                    },

                    setValue(field, eventData) {
                        const {eventDataList, eventList} = eventData;
                        Array.isArray(eventList) &&
                        eventList.map((item) => {
                            field.parent.clearPropValue(item.name);
                            return item;
                        });
                        Array.isArray(eventDataList) &&
                        eventDataList.map((item) => {
                            field.parent.setPropValue(item.name, {
                                type: 'JSFunction',
                                // 需要传下入参
                                value: `function(){return this.${
                                    item.relatedEventName
                                }.apply(this,Array.prototype.slice.call(arguments).concat([${
                                    item.paramStr ? item.paramStr : ''
                                }])) }`,
                            });
                            return item;
                        });
                    },
                },
            ],
        });
    }

    if (!isRoot) {
        if (supports.condition !== false) {
            advancedGroup.push({
                // name: 'extratitle'
                name: 'extraCondition',
                title: {type: 'i18n', 'zh-CN': '是否渲染', 'en-US': 'Condition'},
                defaultValue: true,
                setter: [
                    {
                        componentName: 'BoolSetter',
                    },
                    {
                        componentName: 'VariableSetter',
                    },
                ],
                extraProps: {
                    display: 'block',
                },
            });
        }
        if (supports.loop !== false) {
            advancedGroup.push({
                name: '#loop',
                title: {type: 'i18n', 'zh-CN': '循环', 'en-US': 'Loop'},
                items: [
                    {
                        name: 'extraLoop',
                        title: {type: 'i18n', 'zh-CN': '循环数据', 'en-US': 'Loop Data'},
                        setter: [
                            {
                                componentName: 'JsonSetter',
                                props: {
                                    label: {type: 'i18n', 'zh-CN': '编辑数据', 'en-US': 'Edit Data'},
                                    defaultValue: '[]',
                                },
                            },
                            {
                                componentName: 'VariableSetter',
                            },
                        ],
                    },
                    {
                        name: 'extraLoopArgs.0',
                        title: {type: 'i18n', 'zh-CN': '迭代变量名', 'en-US': 'Loop Item'},
                        setter: {
                            componentName: 'StringSetter',
                            props: {
                                placeholder: {type: 'i18n', 'zh-CN': '默认为: item', 'en-US': 'Defaults: item'},
                            },
                        },
                    },
                    {
                        name: 'extraloopArgs.1',
                        title: {type: 'i18n', 'zh-CN': '索引变量名', 'en-US': 'Loop Index'},
                        setter: {
                            componentName: 'StringSetter',
                            props: {
                                placeholder: {type: 'i18n', 'zh-CN': '默认为: index', 'en-US': 'Defaults: index'},
                            },
                        },
                    },
                    {
                        name: 'key',
                        title: {type: 'i18n', 'zh-CN': '循环 Key', 'en-US': 'Loop Key'},
                        setter: [
                            {
                                componentName: 'StringSetter',
                            },
                            {
                                componentName: 'VariableSetter',
                            },
                        ],
                    },
                ],
                extraProps: {
                    display: 'accordion',
                },
            });
        }

        if (supports.condition !== false || supports.loop !== false) {
            advancedGroup.push({
                name: 'key',
                title: {
                    label: {
                        type: 'i18n',
                        'zh-CN': '渲染唯一标识 (key)',
                        'en-US': 'Render unique identifier (key)',
                    },
                    tip: {
                        type: 'i18n',
                        'zh-CN': '搭配「条件渲染」或「循环渲染」时使用，和 react 组件中的 key 原理相同，点击查看帮助',
                        'en-US': 'Used with 「Conditional Rendering」or「Cycle Rendering」, the same principle as the key in the react component, click to view the help',
                    },
                    docUrl: 'https://www.yuque.com/lce/doc/qm75w3',
                },
                setter: [
                    {
                        componentName: 'StringSetter',
                    },
                    {
                        componentName: 'VariableSetter',
                    },
                ],
                extraProps: {
                    display: 'block',
                },
            });
        }
    }
    if (advancedGroup.length > 0) {
        combined.push({
            name: '#advanced',
            title: {type: 'i18n', 'zh-CN': '高级', 'en-US': 'Advanced'},
            items: advancedGroup,
        });
    }

    return {
        ...metadata,
        ...basicInfo,
        configure: {
            ...configure,
            combined,
        },
    };
}
