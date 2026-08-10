import ProForm, { ProFormDigit, ProFormGroup } from '@ant-design/pro-form';
import MessageInput from '../MessageInput';
import type { Validator } from './interface.d';

const Length: Validator = {
    name: 'len',
    label: 'Length',
    initializeData() {
        return {
            len: 99,
        };
    },
    render(rules, info) {
        return (
            <ProFormGroup>
                <ProFormDigit
                    min={1}
                    name={[...info.path, 'len']}
                    rules={[{ required: true }]}
                    label={'Length'}
                />
                <ProForm.Item name={[...info.path, 'message']} label={'Message'}>
                    <MessageInput />
                </ProForm.Item>
            </ProFormGroup>
        );
    },
};

export default Length;
