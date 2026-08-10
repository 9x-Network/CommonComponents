import { ProFormText } from '@ant-design/pro-form';
import { Select as AntSelect } from 'antd';
import React from 'react';
import type { Component } from '../index';

class DictionariesSelect implements Component {
    name = 'Dictionary Select';
    type = 'DictionariesSelect';
    validators = ['required'];

    getInitialData() {
        return {
            fieldProps: {
                type: 'pay_scenario',
            },
        };
    }

    renderInitialValueField(field: any) {
        return <AntSelect options={field.options} />;
    }

    renderThumb(): React.ReactNode {
        return <AntSelect style={{ width: '100%' }} />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProFormText label={'Dictionary type'} name={['fieldProps', 'type']} />
            </>
        );
    }
}

export default DictionariesSelect;
