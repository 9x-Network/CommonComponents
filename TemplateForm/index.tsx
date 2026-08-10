import type { ProFormProps } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { Empty } from 'antd';
import React from 'react';
import type { TemplateConfig } from './FormItem';
import TemplateFormItem from './FormItem';

export interface TemplateFormProps extends Omit<ProFormProps, 'form'> {
    templates?: TemplateConfig[];
    readonly?: boolean;
    form?: ProFormProps['form'] | false;
    namePrefix?: string | (string | number)[];
    renderFormItem?: (
        dom: React.ReactElement,
        template: TemplateConfig,
        opt: { readonly?: boolean; namePrefix?: string | (string | number)[] },
    ) => React.ReactElement;
    emptyContent?: React.ReactNode;
}

const TemplateForm = (props: TemplateFormProps) => {
    const {
        templates,
        readonly,
        form,
        namePrefix,
        renderFormItem,
        emptyContent = <Empty />,
        ...rest
    } = props;
    let child = null;
    if (templates) {
        if (Array.isArray(templates)) {
            child = templates.map((item) => (
                <TemplateFormItem
                    key={item.key || (item.name as string)}
                    template={item}
                    readonly={readonly || item.readonly}
                    namePrefix={namePrefix}
                    renderItem={renderFormItem}
                />
            ));
        } else {
            child = (
                <div className={'text-danger'}>Invalid form templates, It must be typeof array</div>
            );
        }
    } else {
        child = emptyContent;
    }
    if (form === false) {
        return (
            <div className={rest.className} style={rest.style}>
                {child}
            </div>
        );
    }
    return (
        <ProForm form={form} {...rest}>
            {child}
        </ProForm>
    );
};

export default TemplateForm;
