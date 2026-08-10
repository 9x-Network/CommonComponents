import ProForm from '@ant-design/pro-form';
import { Radio as AntRadio } from 'antd';
import React from 'react';
import OptionEditor from '../../OptionEditor';
import type { Component } from '../index';

const DemoOptions = () => [
    { label: 'Option1', value: '1' },
    { label: 'Option2', value: '2' },
];

class Radio implements Component {
    name = 'Radio';
    type = 'Radio';
    validators = ['required'];

    getInitialData() {
        return {
            options: DemoOptions(),
        };
    }

    renderInitialValueField() {
        return null;
    }

    renderThumb(): React.ReactNode {
        return <AntRadio.Group options={DemoOptions()} />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProForm.Item name={'options'} label={'Options'} style={{ flexFlow: 'column' }}>
                    <OptionEditor />
                </ProForm.Item>
            </>
        );
    }
}

export default Radio;
