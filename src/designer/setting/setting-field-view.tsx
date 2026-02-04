import {observer} from "mobx-react";
import {Component} from "react";
import {SkeletonContext} from "@/sketeton/context/context.ts";
import {createField} from "@/sketeton/component/settings/settings-pane.tsx";

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
        // if(isSetterConfig(setter)){
        //     setterType = setter.componentName;
        //     if (setter.props) {
        //         setterProps = setter.props;
        //     }
        // }
        setterType = 'MixedSetter';
        setterProps = {
            setters: [
                setter,
                'VariableSetter',
            ],
        };
        return {
            setterProps,
            setterType
        };
    }

    render() {
        const {
            setterProps = {},
            setterType,
        } = this.setterInfo;
        const field = this.field;
        return createField(
            {},
            this.setters?.createSetterContent(setterType, {
                key: field.id,
            })
        );
    }
}
