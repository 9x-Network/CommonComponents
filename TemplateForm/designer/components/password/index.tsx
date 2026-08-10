import { ProFormSwitch } from '@ant-design/pro-form';
import { Input } from 'antd';
import React from 'react';
import type { Component } from '../index';

class Password implements Component {
    name = 'Password Input';
    type = 'Password';
    validators = ['required', 'len', 'pattern', 'whitespace'];

    renderThumb(): React.ReactNode {
        return <Input.Password value={'123456'} />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProFormSwitch
                    name={['fieldProps', 'visibilityToggle']}
                    initialValue={true}
                    label={'Visibility Toggle'}
                />
            </>
        );
    }
}

export default Password;
