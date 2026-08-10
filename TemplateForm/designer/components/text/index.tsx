import { ProFormDigit, ProFormGroup, ProFormSelect } from '@ant-design/pro-form';
import { Input } from 'antd';
import React from 'react';
import type { Component } from '../index';

class Text implements Component {
    name = 'Text Input';
    type = 'Text';
    validators = ['required', 'len', 'pattern', 'type', 'whitespace'];

    renderThumb(): React.ReactNode {
        return <Input />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <ProFormGroup>
                <ProFormSelect
                    name={['fieldProps', 'type']}
                    label={'Input Type'}
                    width={'sm'}
                    options={[
                        { label: 'Text', value: 'text' },
                        { label: 'Tel', value: 'tel' },
                        { label: 'Number', value: 'number' },
                        { label: 'Color', value: 'color' },
                    ]}
                />
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

export default Text;
