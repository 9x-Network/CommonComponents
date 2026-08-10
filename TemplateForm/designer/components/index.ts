import type { FormItemProps } from 'antd';
import type React from 'react';
import Checkbox from './checkbox';
import DatePicker from './datepicker';
import DateRangePicker from './daterangepicker';
import DateTimePicker from './datetimepicker';
import DateTimeRangePicker from './datetimerangepicker';
import DictionariesSelect from './dictionariesselect';
import Digit from './digit';
import ImageUploader from './imageuploader';
import MonthPicker from './monthpicker';
import Password from './password';
import Radio from './radio';
import RemoteDataSelect from './remotedataselect';
import Select from './select';
import Switch from './switch';
import Text from './text';
import TextArea from './textarea';
import TimePicker from './timepicker';
import Uploader from './uploader';

export interface Component {
    name: string;
    type: string;
    validators?: string[];
    getInitialData?: () => any;
    renderInitialValueField?: (
        field: any,
    ) => React.ReactNode | { node: React.ReactNode; formItemProps?: FormItemProps };
    renderThumb: () => React.ReactNode;
    renderCustomFields: () => React.ReactNode;
}

export const Components = [
    Text,
    TextArea,
    Select,
    Checkbox,
    Radio,
    Switch,
    Password,
    Digit,
    DatePicker,
    MonthPicker,
    TimePicker,
    DateTimePicker,
    DateRangePicker,
    DateTimeRangePicker,
    Uploader,
    ImageUploader,
    DictionariesSelect,
    RemoteDataSelect,
];

export const ComponentMap = Components.reduce<Record<string, Component>>((previous, Comp) => {
    const comp = new Comp();
    return { ...previous, [comp.type]: comp };
}, {});
