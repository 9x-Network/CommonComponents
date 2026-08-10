import ProForm, { ProFormGroup, ProFormText } from '@ant-design/pro-form';
import MessageInput from '../MessageInput';
import type { Validator } from './interface.d';

const Pattern: Validator = {
    name: 'pattern',
    label: 'Pattern',
    multiple: true,
    initializeData() {
        return {
            pattern: '',
        };
    },
    render(rules, info) {
        return (
            <ProFormGroup>
                <ProFormText
                    name={[...info.path, 'pattern']}
                    rules={[{ required: true }]}
                    label={'Pattern'}
                />
                <ProForm.Item name={[...info.path, 'message']} label={'Message'}>
                    <MessageInput />
                </ProForm.Item>
            </ProFormGroup>
        );
    },
};

export default Pattern;
