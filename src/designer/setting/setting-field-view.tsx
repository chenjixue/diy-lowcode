import {observer} from "mobx-react";
import {Component} from "react";
import {SkeletonContext} from "@/sketeton/context/context.ts";
import {createField} from "@/sketeton/component/settings-pane/settings-pane.tsx";
import {isSetterConfig} from "@/util/is-setter-config.ts";

interface SettingFieldViewProps {
    field: any
}

interface SettingFieldViewState {

}

@observer
export default class SettingFieldView extends Component<SettingFieldViewProps, SettingFieldViewState> {
    static contextType = SkeletonContext;

    stageName: string | undefined;

    setters?: any;

    field: any;

    constructor(props: SettingFieldViewProps) {
        super(props);
        const {field} = this.props;
        this.field = field;
        const editor = field.designer?.editor;
        this.setters = editor?.get('setters');
    }

    get setterInfo() {
        const {setter} = this.field;
        let setterType: any;
        let setterProps: any;
        if (isSetterConfig(setter)) {
            setterType = setter.componentName;
            if (setter.props) {
                setterProps = setter.props;
                if (typeof setterProps === 'function') {
                    setterProps = setterProps(this.field.internalToShellField());
                }
            }
        }
        if (setterType === 'MixedSetter') {
            if (Array.isArray(setterProps.setters) && !setterProps.setters.includes('VariableSetter')) {
                setterProps.setters.push('VariableSetter');
            }
        }
        return {
            setterProps,
            setterType
        };
    }

    render() {
        const field = this.field
        const {
            setterProps = {},
            setterType,
        } = this.setterInfo;
        return createField(
            {},
            this.setters?.createSetterContent(setterType, {
                ...setterProps,
                field: field.internalToShellField(),
                key: field.id,
            })
        );
    }
}
