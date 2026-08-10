import ProForm, { ProFormDigit, ProFormGroup } from '@ant-design/pro-form';
import MessageInput from '../MessageInput';
import type { Validator } from './interface.d';

const Min: Validator = {
    name: 'min',
    label: 'Min',
    initializeData() {
        return {
            min: 1,
        };
    },
    render(rules, info) {
        return (
            <ProFormGroup>
                <ProFormDigit
                    min={1}
                    name={[...info.path, 'min']}
                    rules={[{ required: true }]}
                    label={'Min'}
                />
                <ProForm.Item name={[...info.path, 'message']} label={'Message'}>
                    <MessageInput />
                </ProForm.Item>
            </ProFormGroup>
        );
    },
};

export default Min;
