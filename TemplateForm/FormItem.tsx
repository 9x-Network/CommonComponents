import AssociativeSelect from '@/components/common/AssociativeSelect';
import Uploader from '@/components/common/Uploader';
import DictionariesSelect from '@/components/Dictionaries/DictionariesSelect';
import type { ProFormItemProps } from '@ant-design/pro-form';
import ProForm, {
    ProFormCheckbox,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormDateTimePicker,
    ProFormDateTimeRangePicker,
    ProFormDigit,
    ProFormRadio,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProFormTimePicker,
} from '@ant-design/pro-form';
import type { CheckboxOptionType } from 'antd';
import React from 'react';
import { extendInternationalFields } from './utils';

export type FieldTypes =
    | 'Text'
    | 'Password'
    | 'DatePicker'
    | 'DateTimePicker'
    | 'DateRangePicker'
    | 'DateTimeRangePicker'
    | 'TimePicker'
    | 'TextArea'
    | 'Checkbox'
    | 'Radio'
    | 'Switch'
    | 'Select'
    | 'Digit'
    | 'Uploader'
    | 'ImageUploader'
    | 'DictionariesSelect'
    | 'RemoteDataSelect';

export type InternationalJSON = Record<string, string>;

export interface TemplateConfig
    extends Omit<ProFormItemProps, 'label' | 'placeholder' | 'extra' | 'help'> {
    key?: string;
    type?: FieldTypes;
    label?: string | InternationalJSON;
    placeholder?: string | InternationalJSON;
    extra?: string | InternationalJSON;
    help?: string | InternationalJSON;
    readonly?: boolean;
    value?: any;
    options?: (CheckboxOptionType | string)[];
}

export interface TemplateFormItemProps {
    template: TemplateConfig;
    readonly?: boolean;
    namePrefix?: string | (string | number)[];
    renderItem?: (
        dom: React.ReactElement,
        template: TemplateConfig,
        opt: { readonly?: boolean; namePrefix?: string | (string | number)[] },
    ) => React.ReactElement;
}

const TemplateFormItem = ({
    template,
    readonly,
    namePrefix,
    renderItem,
}: TemplateFormItemProps) => {
    const { type = 'Text', name: rname, ...restProps } = template;
    let name = rname;
    if (namePrefix) {
        const prefix = typeof namePrefix === 'string' ? [namePrefix] : namePrefix;
        if (typeof name === 'string') {
            name = [...prefix, name];
        } else if (Array.isArray(name)) {
            name = [...prefix, ...name];
        }
    }
    const rest = React.useMemo(() => extendInternationalFields(restProps), [restProps]);
    const notProFormItems = ['Uploader', 'ImageUploader', 'DictionariesSelect', 'RemoteDataSelect'];
    const ElementMap = {
        Text: ProFormText,
        Password: ProFormText.Password,
        DatePicker: ProFormDatePicker,
        MonthPicker: ProFormDatePicker.Month,
        DateTimePicker: ProFormDateTimePicker,
        DateRangePicker: ProFormDateRangePicker,
        DateTimeRangePicker: ProFormDateTimeRangePicker,
        TimePicker: ProFormTimePicker,
        TextArea: ProFormTextArea,
        Checkbox: ProFormCheckbox.Group,
        Radio: ProFormRadio.Group,
        Switch: ProFormSwitch,
        Select: ProFormSelect,
        Digit: ProFormDigit,
        Uploader,
        ImageUploader: Uploader.ImageUploader,
        DictionariesSelect,
        RemoteDataSelect: AssociativeSelect,
    };
    const renderChildren = () => {
        if (!type || !name) {
            return <div className={'text-danger'}>Parameter “name” is a required!</div>;
        }
        const Field = ElementMap[type] as any;
        if (!Field) {
            return <div className={'text-danger'}>Unknown form item config!</div>;
        }
        let dom = null;
        if (notProFormItems.includes(type)) {
            const {
                label,
                labelCol,
                wrapperCol,
                rules,
                initialValue,
                required,
                hidden,
                hasFeedback,
                valuePropName,
                fieldProps,
                ...extProps
            } = rest;
            const elementProps = { ...extProps, ...fieldProps };
            if (readonly) {
                elementProps.disabled = true;
            }
            dom = (
                <ProForm.Item
                    name={name}
                    label={label as any}
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    rules={rules}
                    initialValue={initialValue}
                    required={required}
                    hidden={hidden}
                    hasFeedback={hasFeedback}
                    valuePropName={valuePropName}
                >
                    {React.createElement(Field, elementProps)}
                </ProForm.Item>
            );
        } else {
            dom = React.createElement(Field, {
                ...rest,
                // ...rest?.fieldProps,
                name,
                readonly,
                rules: rest?.rules || rest?.rules,
            });
        }
        return renderItem ? renderItem(dom, template, { readonly, namePrefix }) : dom;
    };

    return renderChildren() as React.ReactElement;
};

export default TemplateFormItem;
