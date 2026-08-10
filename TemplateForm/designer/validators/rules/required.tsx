import ProForm, { ProFormGroup, ProFormSwitch } from '@ant-design/pro-form';
import MessageInput from '../MessageInput';
import type { Validator } from './interface.d';

const Required: Validator = {
    name: 'required',
    label: 'Required',
    initializeData() {
        return {
            required: true,
        };
    },
    render(rules, info) {
        return (
            <ProFormGroup>
                <ProFormSwitch name={[...info.path, 'required']} label={'Required'} />
                <ProForm.Item name={[...info.path, 'message']} label={'Message'}>
                    <MessageInput />
                </ProForm.Item>
            </ProFormGroup>
        );
    },
};

export default Required;
