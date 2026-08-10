import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import { Select as AntSelect } from 'antd';
import React from 'react';
import OptionEditor from '../../OptionEditor';
import type { Component } from '../index';

class Select implements Component {
    name = 'Select';
    type = 'Select';
    validators = ['required'];

    renderInitialValueField(field: any) {
        return <AntSelect options={field.options} mode={field.fieldProps?.mode} />;
    }

    renderThumb(): React.ReactNode {
        return <AntSelect style={{ width: '100%' }} />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProFormSelect
                    width={'sm'}
                    label={'Mode'}
                    name={['fieldProps', 'mode']}
                    options={['multiple', 'tag', 'singe']}
                />
                <ProForm.Item name={'options'} label={'Options'} style={{ flexFlow: 'column' }}>
                    <OptionEditor />
                </ProForm.Item>
            </>
        );
    }
}

export default Select;
