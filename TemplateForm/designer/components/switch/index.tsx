import { ProFormGroup, ProFormText } from '@ant-design/pro-form';
import { Switch as AntSwitch } from 'antd';
import React from 'react';
import type { Component } from '../index';

class Switch implements Component {
    name = 'Switch';
    type = 'Switch';
    validators = ['required'];

    renderInitialValueField() {
        return {
            formItemProps: {
                valuePropName: 'checked',
            },
            node: <AntSwitch />,
        };
    }

    renderThumb(): React.ReactNode {
        return <AntSwitch />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <ProFormGroup>
                <ProFormText label={'Checked label'} name={'checkedChildren'} />
                <ProFormText label={'UnChecked label'} name={'unCheckedChildren'} />
            </ProFormGroup>
        );
    }
}

export default Switch;
