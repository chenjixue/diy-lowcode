import React, {Component} from 'react';
import {Tab} from '@alifd/next';
import {action, computed, makeObservable, observable} from "mobx";
import {observer} from 'mobx-react';
import {Title} from "@/sketeton/component/title";
import {Editor} from "@/editor/editor.ts";
import {Selection} from "@/designer/document/selection.ts"
import {Designer} from "@/designer/designer.ts";

export class SettingsMain {
    @observable.ref private _settings?: any;
    private _designer?: Designer;

    constructor(readonly editor: Editor) {
        makeObservable(this);
        this.init();
    }

    get designer(): Designer | undefined {
        return this._designer;
    }

    @computed get settings() {
        return this._settings;
    }

    private async init() {
        const setupSelection = (selection: Selection) => {
            this.setup(selection.getNodes());
        }
        const designer = await this.editor.onceGot('designer');
        this._designer = designer;
        this.editor.eventBus.on('designer.selection.change', setupSelection);
    }

    @action
    private setup(nodes: any[]) {
        this._settings = nodes[0].settingEntry;
        if (nodes.length === 1) {
            this._settings = nodes[0].settingEntry;
        } else {
            this._settings = this._designer.createSettingEntry(nodes);
        }
    }

}

@observer
export class SettingsPrimaryPane extends Component<any, any> {
    private main = new SettingsMain(this.props.engineEditor);
    @observable.ref private _activeKey?: any;

    constructor(props: any) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
        const editor = this.props.engineEditor;
        editor.eventBus.on('designer.selection.change', () => {
            this._activeKey = null;
        });
    }

    render() {
        let matched = false;
        const {settings} = this.main;
        if (!settings) {
            // 未选中节点，提示选中 或者 显示根节点设置
            return (
                <div className="lc-settings-main">
                    <div className="lc-settings-notice">
                        <p>{'Please select a node in canvas'}</p>
                    </div>
                </div>
            );
        }
        const {items} = settings;
        console.log(items, "items---");
        // return (<div>
        //     测试设定页面
        // </div>)
        const editor = this.props.engineEditor;
        const tabs = items.map((field) => {
            if (this._activeKey === field.name) {
                matched = true;
            }
            return (
                <Tab.Item
                    className="lc-settings-tab-item"
                    title={<Title title={field.title} />}
                    key={field.name}
                    onClick={
                        () => {
                            // editor?.eventBus.emit('skeleton.settingsPane.change', {
                            //     name: field.name,
                            //     title: field.title,
                            // });
                        }
                    }
                >
                </Tab.Item>
            )
        })
        const activeKey = matched ? this._activeKey : items[0].name
        return (
            <div>
                <Tab
                    activeKey={activeKey}
                    onChange={(tabKey) => {
                        this._activeKey = tabKey;
                    }}
                    navClassName="lc-settings-tabs"
                    animation={false}
                    excessMode="dropdown"
                    contentClassName="lc-settings-tabs-content"
                >
                    {tabs}
                    {/*<Tab.Item>1</Tab.Item>*/}
                    {/*<Tab.Item>2</Tab.Item>*/}
                    {/*<Tab.Item>3</Tab.Item>*/}
                </Tab>
            </div>
        )
    }
}

