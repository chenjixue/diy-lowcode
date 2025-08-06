import { Component, PureComponent, createElement, Fragment } from "react";
import { render as reactRender } from 'react-dom';
import { Router, Route, Switch } from 'react-router';
// import { observer } from 'mobx-react';
// import classNames from 'classnames';
// import LowCodeRenderer from '../react-renderer/index.ts';
// import { computed, observable, makeObservable } from "mobx";
// import { createMemoryHistory, MemoryHistory } from 'history';
class Layout extends Component {
    render() {
        const { children } = this.props;
        return <Fragment>{children}</Fragment>;
    }
}
class Renderer extends Component<{
    rendererContainer: SimulatorRendererContainer;
    documentInstance: DocumentInstance;
}> {
    startTime: number | null = null;
    schemaChangedSymbol = false;

    componentDidUpdate() {
        this.recordTime();
    }

    recordTime() {
        if (this.startTime) {
            const time = Date.now() - this.startTime;
            const nodeCount = host.designer.currentDocument?.getNodeCount?.();
            host.designer.editor?.eventBus.emit(GlobalEvent.Node.Rerender, {
                componentName: 'Renderer',
                type: 'All',
                time,
                nodeCount,
            });
        }
    }

    componentDidMount() {
        this.recordTime();
    }

    getSchemaChangedSymbol = () => {
        return this.schemaChangedSymbol;
    };

    setSchemaChangedSymbol = (symbol: boolean) => {
        this.schemaChangedSymbol = symbol;
    };

    render() {
        const { documentInstance, rendererContainer: renderer } = this.props;
        const { container, document } = documentInstance;
        const { designMode, device, locale } = container;
        const messages = container.context?.utils?.i18n?.messages || {};
        this.startTime = Date.now();
        this.schemaChangedSymbol = false;

        if (!container.autoRender || isRendererDetached()) {
            return null;
        }

        const { intl } = createIntl(locale);

        return (
            <div></div>
            // <LowCodeRenderer
            //     locale={locale}
            //     messages={messages}
            //     schema={documentInstance.schema}
            //     components={container.components}
            //     appHelper={container.context}
            //     designMode={designMode}
            //     device={device}
            //     documentId={document.id}
            //     suspended={renderer.suspended}
            //     self={renderer.scope}
            //     getSchemaChangedSymbol={this.getSchemaChangedSymbol}
            //     setSchemaChangedSymbol={this.setSchemaChangedSymbol}
            //     getNode={(id: string) => documentInstance.getNode(id) as Node}
            //     rendererName="PageRenderer"
            //     thisRequiredInJSE={host.thisRequiredInJSE}
            //     notFoundComponent={host.notFoundComponent}
            //     faultComponent={host.faultComponent}
            //     faultComponentMap={host.faultComponentMap}
            //     customCreateElement={(Component: any, props: any, children: any) => {
            //         const {__id, ...viewProps} = props;
            //         viewProps.componentId = __id;
            //         const leaf = documentInstance.getNode(__id) as Node;
            //         if (isFromVC(leaf?.componentMeta)) {
            //             viewProps._leaf = leaf.internalToShellNode();
            //         }
            //         viewProps._componentName = leaf?.componentName;
            //         // 如果是容器 && 无children && 高宽为空 增加一个占位容器，方便拖动
            //         if (
            //             !viewProps.dataSource &&
            //             leaf?.isContainer() &&
            //             (children == null || (Array.isArray(children) && !children.length)) &&
            //             (!viewProps.style || Object.keys(viewProps.style).length === 0)
            //         ) {
            //             let defaultPlaceholder = intl('Drag and drop components or templates here');
            //             const lockedNode = getClosestNode(leaf, (node) => {
            //                 return node?.getExtraProp('isLocked')?.getValue() === true;
            //             });
            //             if (lockedNode) {
            //                 defaultPlaceholder = intl('Locked elements and child elements cannot be edited');
            //             }
            //             children = (
            //                 <div className={cn('lc-container-placeholder', {'lc-container-locked': !!lockedNode})}
            //                      style={viewProps.placeholderStyle}>
            //                     {viewProps.placeholder || defaultPlaceholder}
            //                 </div>
            //             );
            //         }
            //         if (viewProps._componentName === 'a') {
            //             delete viewProps.href;
            //         }
            //         // FIXME: 渲染仍有问题
            //         if (viewProps._componentName === 'Menu') {
            //             Object.assign(viewProps, {
            //                 _componentName: 'Menu',
            //                 className: '_css_pesudo_menu_kbrzyh0f',
            //                 context: {VE: (window as any).VisualEngine},
            //                 direction: undefined,
            //                 events: {ignored: true},
            //                 fieldId: 'menu_kbrzyh0f',
            //                 footer: '',
            //                 header: '',
            //                 mode: 'inline',
            //                 onItemClick: {ignored: true},
            //                 onSelect: {ignored: true},
            //                 popupAlign: 'follow',
            //                 selectMode: false,
            //                 triggerType: 'click',
            //             });
            //         }

            //         if (!isReactComponent(Component)) {
            //             console.error(`${viewProps._componentName} is not a react component!`);
            //             return null;
            //         }

            //         return createElement(
            //             getDeviceView(Component, device, designMode),
            //             viewProps,
            //             leaf?.isContainer() ? (children == null ? [] : Array.isArray(children) ? children : [children]) : children,
            //         );
            //     }}
            //     __host={host}
            //     __container={container}
            //     onCompGetRef={(schema: any, ref: ReactInstance | null) => {
            //         documentInstance.mountInstance(schema.id, ref);
            //     }}
            //     enableStrictNotFoundMode={host.enableStrictNotFoundMode}
            // />
        );
    }
}
export class Routes extends Component<{ rendererContainer: SimulatorRendererContainer }> {
    render() {
        const { rendererContainer } = this.props;
        return (
            <Switch>
                {rendererContainer.documentInstances.map((instance) => {
                    return (
                        <Route
                            path={instance.path}
                            key={instance.id}
                            render={(routeProps) => <Renderer documentInstance={instance}
                                rendererContainer={rendererContainer} {...routeProps} />}
                        />
                    );
                })}
            </Switch>
        );
    }
}
export default class SimulatorRendererView extends Component<{ rendererContainer: SimulatorRendererContainer }> {
    render() {
        const { rendererContainer } = this.props;
        return (
            <Router history={rendererContainer.history}>
                <Layout>
                    <Routes rendererContainer={rendererContainer} />
                </Layout>
            </Router>
        );
    }
}