import ProForm, { ProFormDigit, ProFormGroup } from '@ant-design/pro-form';
import { Input, InputNumber } from 'antd';
import React from 'react';
import type { Component } from '../index';

class TextArea implements Component {
    name = 'Text Area Input';
    type = 'TextArea';
    validators = ['required', 'len', 'pattern', 'type', 'whitespace'];

    renderThumb(): React.ReactNode {
        return <Input.TextArea />;
    }

    renderInitialValueField() {
        return <Input.TextArea />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <ProFormGroup>
                <ProForm.Item label={'Rows'} name={['fieldProps', 'rows']}>
                    <InputNumber min={1} max={999} step={1} />
                </ProForm.Item>
                <ProFormDigit
                    width={'sm'}
                    min={1}
                    name={['fieldProps', 'maxLength']}
                    label={'Max Length'}
                />
            </ProFormGroup>
        );
    }
}

export default TextArea;
