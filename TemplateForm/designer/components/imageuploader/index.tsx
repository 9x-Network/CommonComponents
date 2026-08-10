import JsonEditor from '@/components/common/JSONEditor';
import UploaderComp from '@/components/common/Uploader';
import ProForm, { ProFormDigit, ProFormGroup, ProFormSwitch } from '@ant-design/pro-form';
import React from 'react';
import type { Component } from '../index';

class ImageUploader implements Component {
    name = 'Image Uploader';
    type = 'ImageUploader';
    validators = ['required'];

    renderInitialValueField() {
        return null;
    }

    renderThumb(): React.ReactNode {
        return <UploaderComp.ImageUploader />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProFormGroup>
                    <ProFormSwitch name={'multiple'} label={'Multiple'} />
                    <ProFormDigit min={1} name={'maxCount'} label={'Max Count(When Multiple)'} />
                </ProFormGroup>
                <ProForm.Item name={'data'} label={'Preset Data'}>
                    <JsonEditor />
                </ProForm.Item>
            </>
        );
    }
}

export default ImageUploader;
