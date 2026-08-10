import ProForm, { ProFormGroup, ProFormSwitch } from '@ant-design/pro-form';
import MessageInput from '../MessageInput';
import type { Validator } from './interface.d';

const Whitespace: Validator = {
    name: 'whitespace',
    label: 'Whitespace',
    initializeData() {
        return {
            whitespace: true,
        };
    },
    render(rules, info) {
        return (
            <ProFormGroup>
                <ProFormSwitch name={[...info.path, 'whitespace']} label={'Whitespace'} />
                <ProForm.Item name={[...info.path, 'message']} label={'Message'}>
                    <MessageInput />
                </ProForm.Item>
            </ProFormGroup>
        );
    },
};

export default Whitespace;
