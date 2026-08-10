import JsonEditor from '@/components/common/JSONEditor';
import UploaderComp from '@/components/common/Uploader';
import ProForm, {
    ProFormDigit,
    ProFormGroup,
    ProFormSwitch,
    ProFormText,
} from '@ant-design/pro-form';
import React from 'react';
import type { Component } from '../index';

class Uploader implements Component {
    name = 'Uploader';
    type = 'Uploader';
    validators = ['required'];

    renderInitialValueField() {
        return null;
    }

    renderThumb(): React.ReactNode {
        return <UploaderComp />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProFormGroup>
                    <ProFormSwitch name={'multiple'} label={'Multiple'} />
                    <ProFormDigit min={1} name={'maxCount'} label={'Max Count(When Multiple)'} />
                </ProFormGroup>
                <ProFormText name={'accept'} label={'Accept'} />
                <ProForm.Item name={'data'} label={'Preset Data'}>
                    <JsonEditor />
                </ProForm.Item>
            </>
        );
    }
}

export default Uploader;
