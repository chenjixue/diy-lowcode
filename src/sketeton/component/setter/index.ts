import MixedSetter from './mixed-setter';
import {DatePicker, TimePicker} from '@alifd/next';
import {isPlainObject} from "@/util/is-plain-object.ts"
import ExpressionSetter from './expression-setter';
import ColorSetter from './color-setter';
import JsonSetter from './json-setter';
import EventsSetter from './events-setter';
import StyleSetterV2 from './style-setter';
import IconSetter from './icon-setter';
import FunctionSetter from './function-setter';
import ClassNameSetter from './classname-setter';
import StringSetter from './string-setter';
import SelectSetter from './select-setter';
import RadioGroupSetter from './radiogroup-setter';
import BoolSetter from './bool-setter';
import NumberSetter from './number-setter';
import I18nSetter from './i18n-setter';
import SlotSetter from './slot-setter';
import TextAreaSetter from './textarea-setter';
import ArraySetter from './array-setter';
import ObjectSetter from './object-setter';
import VariableSetter from './variable-setter';
import TitleSetter from './title-setter';
import './index.less';
import {isJSExpression} from "@/util/asset.ts";
import {isJSFunction} from "@/util/is-isfunction.ts";
import {isJSSlot} from "@/util/is-jsslot.ts";
// suggest: 做成 StringSetter 的一个参数，
// export const TextAreaSetter = {
//   component: TextAreaSetter,
//   title: 'TextareaSetter',
//   recommend: true,
//   condition: (field: any) => {
//     const v = field.getValue();
//     return typeof v === 'string';
//   },
// };

export const DateSetter = DatePicker;
export const DateYearSetter = DatePicker.YearPicker;
export const DateMonthSetter = DatePicker.MonthPicker;
export const DateRangeSetter = DatePicker.RangePicker;

// export {ExpressionSetter, EventsSetter, JsonSetter, IconSetter};

const DataExpressionSetter = {
    component: ExpressionSetter,
    condition: (field: any) => {
        const v = field.getValue();
        return isJSExpression(v);
    },
    valueType: ['JSExpression'],
    defaultProps: {placeholder: '请输入表达式'},
    title: '表达式输入',
    recommend: true,
};

const DataVariableSetter = {
    component: VariableSetter,
    condition: (field: any) => {
        const v = field.getValue();
        return isJSExpression(v);
    },
    valueType: ['JSExpression'],
    title: '变量输入',
    recommend: true,
};

const FunctionBindSetter = {
    component: FunctionSetter,
    title: '函数绑定',
    condition: (field: any) => {
        const v = field.getValue();
        return isJSFunction(v);
    },

    valueType: ['JSFunction'],
};

const DataJsonSetter = {
    component: JsonSetter,
    valueType: ['object', 'array'],
};

const DataArraySetter = {
    component: ArraySetter,
    defaultProps: {},
    title: 'ArraySetter',
    condition: (field: any) => {
        const v = field.getValue();
        return v == null || Array.isArray(v);
    },
    initialValue: [],
    recommend: true,
    valueType: ['array'],
};

const DataObjectSetter = {
    component: ObjectSetter,
    // todo: defaultProps
    defaultProps: {},
    title: 'ObjectSetter', // TODO
    condition: (field: any) => {
        const v = field.getValue();
        return v == null || isPlainObject(v);
    },
    initialValue: {},
    recommend: true,
};

const DataSlotSetter = {
    component: SlotSetter,
    title: {
        type: 'i18n',
        'zh-CN': '插槽输入',
        'en-US': 'Slot Setter',
    },
    condition: (field: any) => {
        return isJSSlot(field.getValue());
    },
    initialValue: (field: any, value: any) => {
        if (isJSSlot(value)) {
            return value;
        }
        return {
            type: 'JSSlot',
            value,
        };
    },
    recommend: true,
    valueType: ['JSSlot'],
};

const engineExt = {
    setters: {
        StringSetter,
        NumberSetter,
        BoolSetter,
        SelectSetter,
        VariableSetter: DataVariableSetter,
        ExpressionSetter: DataExpressionSetter,
        RadioGroupSetter,
        TextAreaSetter,
        // DateSetter: StringDateSetter,
        // TimePicker: StringTimePicker,
        DateYearSetter,
        DateMonthSetter,
        DateRangeSetter,
        EventsSetter,
        ColorSetter,
        JsonSetter: DataJsonSetter,
        StyleSetter: StyleSetterV2,
        IconSetter,
        ClassNameSetter,
        I18nSetter,
        FunctionSetter: FunctionBindSetter,
        MixedSetter,
        SlotSetter: DataSlotSetter,
        ArraySetter: DataArraySetter,
        ObjectSetter: DataObjectSetter,
        TitleSetter,
    },

    setterMap: {
        StringSetter,
        NumberSetter,
        BoolSetter,
        SelectSetter,
        VariableSetter: DataVariableSetter,
        ExpressionSetter: DataExpressionSetter,
        RadioGroupSetter,
        TextAreaSetter,
        // DateSetter: StringDateSetter,
        // TimePicker: StringTimePicker,
        DateYearSetter,
        DateMonthSetter,
        DateRangeSetter,
        EventsSetter,
        ColorSetter,
        JsonSetter: DataJsonSetter,
        StyleSetter: StyleSetterV2,
        IconSetter,
        ClassNameSetter,
        I18nSetter,
        FunctionSetter: FunctionBindSetter,
        MixedSetter,
        SlotSetter: DataSlotSetter,
        ArraySetter: DataArraySetter,
        ObjectSetter: DataObjectSetter,
        TitleSetter,
    },

    pluginMap: {
        // EventBindDialog,
        // VariableBindDialog,
    },
};
// window.AliLowCodeEngineExt = engineExt;
export default engineExt;

// registerSetter(builtinSetters);
