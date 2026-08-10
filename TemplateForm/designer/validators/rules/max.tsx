import ProForm, { ProFormDigit, ProFormGroup } from '@ant-design/pro-form';
import MessageInput from '../MessageInput';
import type { Validator } from './interface.d';

const Max: Validator = {
    name: 'max',
    label: 'Max',
    initializeData() {
        return {
            max: 99,
        };
    },
    render(rules, info) {
        return (
            <ProFormGroup>
                <ProFormDigit
                    min={1}
                    name={[...info.path, 'max']}
                    rules={[{ required: true }]}
                    label={'Max'}
                />
                <ProForm.Item name={[...info.path, 'message']} label={'Message'}>
                    <MessageInput />
                </ProForm.Item>
            </ProFormGroup>
        );
    },
};

export default Max;
