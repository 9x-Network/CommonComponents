import ProForm, { ProFormGroup, ProFormSelect } from '@ant-design/pro-form';
import MessageInput from '../MessageInput';
import type { Validator } from './interface.d';

const Types = [
    'string',
    'email',
    'url',
    'number',
    'boolean',
    'method',
    'regexp',
    'integer',
    'float',
    'object',
    'date',
    'hex',
];

const Type: Validator = {
    name: 'type',
    label: 'Type',
    initializeData() {
        return {
            type: 'string',
        };
    },
    render(rules, info) {
        return (
            <ProFormGroup>
                <ProFormSelect
                    allowClear={false}
                    options={Types}
                    name={[...info.path, 'type']}
                    rules={[{ required: true }]}
                    label={'Type'}
                />
                <ProForm.Item name={[...info.path, 'message']} label={'Message'}>
                    <MessageInput />
                </ProForm.Item>
            </ProFormGroup>
        );
    },
};

export default Type;
