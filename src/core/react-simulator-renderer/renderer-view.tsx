import { Component, PureComponent, createElement, Fragment } from "react";
import { render as reactRender } from 'react-dom';
import { Router, Route, Switch } from 'react-router';
import LowCodeRenderer from '../react-renderer/index.ts';

// import { observer } from 'mobx-react';
// import classNames from 'classnames';
// import { computed, observable, makeObservable } from "mobx";
// import { createMemoryHistory, MemoryHistory } from 'history';
class Layout extends Component {
    render() {
        const { children } = this.props;
        return <Fragment>{children}</Fragment>;
    }
}
class Renderer extends Component<{
    rendererContainer: any;
    documentInstance: any;
}> {
    startTime: number | null = null;
    schemaChangedSymbol = false;
    getSchemaChangedSymbol = () => {
        return this.schemaChangedSymbol;
    };

    setSchemaChangedSymbol = (symbol: boolean) => {
        this.schemaChangedSymbol = symbol;
    };

    render() {
        const { documentInstance, rendererContainer: renderer } = this.props;
        const { container, document } = documentInstance;
        // const { designMode, device, locale } = container;
        const messages = container.context?.utils?.i18n?.messages || {};
        this.startTime = Date.now();
        this.schemaChangedSymbol = false;

        // if (!container.autoRender || isRendererDetached()) {
        //     return null;
        // }

        return (
            // rendererFactory
            <LowCodeRenderer
                schema={documentInstance.schema}
                components={container.components}
                documentId={document.id}
                rendererName="PageRenderer"
                customCreateElement={(Component: any, props: any, children: any) => {
                    return createElement(
                        Component,
                        {},
                        (children == null ? [] : Array.isArray(children) ? children : [children])
                    );

                }}
            />
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