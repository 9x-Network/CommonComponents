import { ProFormDigit, ProFormGroup } from '@ant-design/pro-form';
import { InputNumber } from 'antd';
import React from 'react';
import type { Component } from '../index';

class Digit implements Component {
    name = 'Digit Input';
    type = 'Digit';
    validators = ['required', 'min', 'max'];

    renderThumb(): React.ReactNode {
        return <InputNumber value={123} style={{ width: '100%' }} />;
    }

    renderInitialValueField(field: any) {
        return <InputNumber max={field.max} style={{ width: '100%' }} />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <ProFormGroup>
                <ProFormDigit label={'Min'} name={'min'} />
                <ProFormDigit label={'Max'} name={'max'} />
            </ProFormGroup>
        );
    }
}

export default Digit;
