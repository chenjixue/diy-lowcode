import React, {
    Component,
    PureComponent,
    createElement,
    createContext,
    forwardRef,
    ReactInstance,
    ContextType
} from 'react';
import ReactDOM from 'react-dom';
import adapter from './adapter.ts';
import {isEmpty} from 'lodash';
import contextFactory from './context.ts';
import classnames from 'classnames';

adapter.setRuntime({
    Component,
    PureComponent,
    createContext,
    createElement,
    forwardRef,
    findDOMNode: ReactDOM.findDOMNode,
});

adapter.setRenderers({
    PageRenderer: pageRendererFactory()
});

/**
 * get children from a node schema
 * @PRIVATE
 */
export function getSchemaChildren(schema: any) {
    if (!schema) {
        return;
    }

    if (!schema.props) {
        return schema.children;
    }

    if (!schema.children) {
        return schema.props.children;
    }

    if (!schema.props.children) {
        return schema.children;
    }

    let result = ([]).concat(schema.children);
    if (Array.isArray(schema.props.children)) {
        result = result.concat(schema.props.children);
    } else {
        result.push(schema.props.children);
    }
    return result;
}

export function baseRendererFactory() {
    // const { BaseRenderer: customBaseRenderer } = adapter.getRenderers();

    // if (customBaseRenderer) {
    //   return customBaseRenderer;
    // }
    const AppContext = contextFactory();
    const {Component, createElement} = adapter.getRuntime();
    const DESIGN_MODE = {
        EXTEND: 'extend',
        BORDER: 'border',
        PREVIEW: 'preview',
    };
    const OVERLAY_LIST = ['Dialog', 'Overlay', 'Animate', 'ConfigProvider'];
    let scopeIdx = 0;

    return class BaseRenderer extends Component {
        [key: string]: any;

        static displayName = 'BaseRenderer';

        static defaultProps = {
            __schema: {},
        };

        static contextType = AppContext;

        constructor(props: any, context: any) {
            super(props, context);
            this.context = context;
        }

        __createDom = () => {
            const {__schema, __ctx, __components = {}} = this.props;

            const _children = getSchemaChildren(__schema);
            let Comp = __components[__schema.componentName];
            const parentNodeInfo = ({
                schema: __schema,
                Comp
            });
            return this.__createVirtualDom(_children, {}, parentNodeInfo);
        };
        __renderContextProvider = (customProps?: object, children?: any) => {
            return createElement(AppContext.Provider, {
                value: {
                    ...(customProps || {})
                },
                children: this.__createDom(),
            });
        };
        // __parseData = (data: any, ctx?: Record<string, any>) => {
        //   const { __ctx, thisRequiredInJSE, componentName } = this.props;
        //   return parseData(data, ctx || __ctx || this, { thisRequiredInJSE, logScope: componentName });
        // };
        __renderContent(children: any) {
            const {__schema} = this.props;
            // const parsedProps = this.__parseData(__schema.props);
            // const className = classnames(`lce-${this.__namespace}`, getFileCssName(__schema.fileName), parsedProps.className, this.props.className);
            // const style = { ...(parsedProps.style || {}), ...(typeof this.props.style === 'object' ? this.props.style : {}) };
            const id = this.props.id
            return createElement('div', {
                // ref: this.__getRef,
                // className,
                id,
                // style,
            }, children);
        }

        /**
         * 将模型结构转换成react Element
         * @param originalSchema schema
         * @param originalScope scope
         * @param parentInfo 父组件的信息，包含schema和Comp
         * @param idx 为循环渲染的循环Index
         */
        __createVirtualDom = (originalSchema: any, originalScope: any, parentInfo: any, idx: string | number = ''): any => {
            if (originalSchema === null || originalSchema === undefined) {
                return null;
            }
            let scope = originalScope;
            let schema = originalSchema;
            const {engine} = this.context || {};
            const otherProps: any = {}
            const {__appHelper: appHelper, __components: components = {}} = this.props || {};
            if (typeof schema === 'string') {
                return schema;
            }

            if (typeof schema === 'number' || typeof schema === 'boolean') {
                return String(schema);
            }

            if (Array.isArray(schema)) {
                if (schema.length === 1) {
                    return this.__createVirtualDom(schema[0], scope, parentInfo);
                }
                return schema.map((item, idy) => this.__createVirtualDom(item, scope, parentInfo, ''))
            }
            // const _children = getSchemaChildren(schema);
            if (!schema.componentName) {
                return;
            }
            if (schema.componentName === 'Text' && typeof schema.props?.text === 'string') {
                const text: string = schema.props?.text;
                schema = {...schema};
                schema.children = [text];
            }
            let Comp = components[schema.componentName]

            let child = this.__getSchemaChildrenVirtualDom(schema, scope, Comp, false);
            otherProps.ref = (ref: any) => {
                ref && engine.props?.onCompGetRef(schema, ref);
            }
            const renderComp = (innerProps: any) => engine.createElement(Comp, innerProps, child);
            return renderComp({
                ...otherProps,
                __inner__: {
                    hidden: schema.hidden,
                },
            });
        };

        __getSchemaChildrenVirtualDom(schema: any, scope: any, Comp: any, condition: any) {
            let children = getSchemaChildren(schema);
            let result: any = [];
            if (children) {
                if (!Array.isArray(children)) {
                    children = [children];
                }

                children.forEach((child: any) => {
                    const childVirtualDom = this.__createVirtualDom(
                        child,
                        scope,
                        {
                            schema,
                            Comp,
                        },
                    );

                    result.push(childVirtualDom);
                });
            }
            if (result && result.length > 0) {
                return result;
            }
            return null;
        }
    };
}


export function pageRendererFactory(): any {
    const BaseRenderer = baseRendererFactory();
    return class PageRenderer extends BaseRenderer {
        static displayName = 'PageRenderer';

        __namespace = 'page';

        setState(state: any, callback?: () => void) {
            super.setState(state, callback);
        }

        render() {
            // const { __schema, __components } = this.props;
            return this.__renderContent(this.__renderContextProvider({pageContext: this}));
        }
    };
}

export function rendererFactory() {
    const {PureComponent, Component, createElement, findDOMNode} = adapter.getRuntime();
    const RENDERER_COMPS: any = adapter.getRenderers();
    const BaseRenderer = baseRendererFactory();
    const AppContext = contextFactory();

    return class Renderer extends Component {
        static displayName = 'Renderer';

        state = {};

        __ref: any;

        static findDOMNode = findDOMNode;

        constructor(props: any, context: any) {
            super(props, context);
            this.state = {};
        }

        createElement(SetComponent: any, props: any, children?: any) {
            return this.props.customCreateElement(SetComponent, props, children);
        }

        getComp() {
            const {schema, components} = this.props;
            const {componentName} = schema;
            const allComponents = {...RENDERER_COMPS, ...components};
            let Comp = allComponents[componentName] || RENDERER_COMPS[`${componentName}Renderer`];
            if (Comp && Comp.prototype) {
                if (!(Comp.prototype instanceof BaseRenderer)) {
                    Comp = RENDERER_COMPS[`${componentName}Renderer`];
                }
            }
            return Comp;
        }

        render() {
            const {schema, components} = this.props;
            const allComponents = {...RENDERER_COMPS, ...components};
            const Comp = this.getComp();


            if (Comp) {
                return createElement(AppContext.Provider, {
                        value: {
                            components: allComponents,
                            engine: this,
                        },
                    },
                    createElement(Comp, {
                        __components: allComponents,
                        __schema: schema,
                        ...this.props,
                    })
                )

            }
            return null;
        }
    };
}

function factory(): any {
    const Renderer = rendererFactory();
    return class ReactRenderer extends Renderer implements Component {
        readonly props: types.IRendererProps;

        context: ContextType<any>;

        setState: (
            state: types.IRendererState,
            callback?: () => void,
        ) => void;

        forceUpdate: (callback?: () => void) => void;

        refs: {
            [key: string]: ReactInstance;
        };

        constructor(props: types.IRendererProps, context: ContextType<any>) {
            super(props, context);
        }

        isValidComponent(obj: any) {
            return obj?.prototype?.isReactComponent || obj?.prototype instanceof Component;
        }
    };
}

export default factory();
