import {Component, PureComponent} from "react";
import classNames from 'classnames';
import {computed, observable} from "mobx";
import {ProjectView} from "@/project/project-view.tsx";
import {Designer} from "@/designer/designer.ts";
import "./designer.less"
interface IDesignerViewProps {
    className: string;
    style:string;
    designer: Designer;
}

export class DesignerView extends Component<IDesignerViewProps>{
    readonly designer: Designer;
    readonly viewName: string | undefined;
    @observable.ref private _simulatorProps: any;

    constructor(props:IDesignerViewProps) {
        super(props);
        const {designer, ...designerProps} = props;
        this.viewName = designer?.viewName;
        if (designer) {
            this.designer = designer;
            designer.setProps(designerProps);
        } else {
            // this.designer = new Designer(designerProps);
        }
    }

    setProps(nextProps) {
        const props = this.props ? {...this.props, ...nextProps} : nextProps;
        // if (props.simulatorProps !== this.props.simulatorProps) {
        this._simulatorProps = props.simulatorProps;
        // }
    }

    @computed get simulatorProps(): Record<string, any> {
        return this._simulatorProps || {};
    }

    render() {
        const {className, style} = this.props;
        return (
            <div className={classNames('lc-designer', className)} style={style}>
                <ProjectView designer={this.designer} />
            </div>
        );
    }
}


export default class DesignerPlugin extends PureComponent<any, any> {
    static displayName: 'LowcodePluginDesigner';

    state = {
        componentMetadatas: null,
        library: null,
    };

    private _mounted = true;

    constructor(props: any) {
        super(props);
        this.setupAssets();
    }

    private async setupAssets() {
        const editor = this.props.engineEditor;
        const assets = await editor.onceGot('assets');
        const {components, packages, extraEnvironment, utils} = assets;
        const state = {
            componentMetadatas: components || [],
            library: packages || [],
        };
        this.setState(state);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    render(): React.ReactNode {
        const editor = this.props.engineEditor;
        // if (!library || !componentMetadatas) {
        //     // TODO: use a Loading
        //     return null;
        // }
        const {
            componentMetadatas,
            library,
        } = this.state;

        if (!library) {
            // TODO: use a Loading
            return null;
        }
        return (
            <DesignerView className="lowcode-plugin-designer" designer={editor.get('designer')}
                          simulatorProps={{
                              library
                          }}
            />
        );
    }
}
