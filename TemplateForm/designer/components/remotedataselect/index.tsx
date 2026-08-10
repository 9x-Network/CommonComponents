import JSONEditor from '@/components/common/JSONEditor';
import ProForm, { ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import { Select as AntSelect } from 'antd';
import React from 'react';
import type { Component } from '../index';

class RemoteDataSelect implements Component {
    name = 'Remote Data Select';
    type = 'RemoteDataSelect';
    validators = ['required'];

    getInitialData() {
        return {
            request: () => Promise.resolve({ list: [] }),
        };
    }

    renderInitialValueField() {
        return null;
    }

    renderThumb(): React.ReactNode {
        return <AntSelect style={{ width: '100%' }} />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProForm.Group>
                    <ProFormSwitch
                        label={'Searchable'}
                        initialValue={true}
                        name={['fieldProps', 'showSearch']}
                    />
                    <ProFormSelect
                        label={'Select Mode'}
                        name={['fieldProps', 'mode']}
                        allowClear
                        options={[
                            { label: 'Multiple', value: 'multiple' },
                            { label: 'Tag', value: 'tag' },
                        ]}
                    />
                </ProForm.Group>
                <ProFormText label={'Source url'} name={['fieldProps', 'request']} />
                <ProFormText
                    label={'Response property key'}
                    initialValue={'list'}
                    name={['fieldProps', 'responseListKey']}
                />
                <ProFormText label={'Label key'} name={['fieldProps', 'labelKey']} />
                <ProFormText label={'Value key'} name={['fieldProps', 'valueKey']} />
                <ProFormText label={'Search key'} name={['fieldProps', 'searchKey']} />
                <ProForm.Item label={'Params'} name={['fieldProps', 'params']}>
                    <JSONEditor />
                </ProForm.Item>
            </>
        );
    }
}

export default RemoteDataSelect;
