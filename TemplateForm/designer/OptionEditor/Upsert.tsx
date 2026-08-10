import { DrawerForm, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import React from 'react';

const Upsert = ({
    children,
    onFinish,
    data,
}: {
    onFinish?: (formData: any) => Promise<boolean | void>;
    data?: any;
    children?: React.ReactNode;
}) => {
    return (
        <DrawerForm
            trigger={children as React.ReactElement}
            title={'Options'}
            width={500}
            onFinish={onFinish}
            initialValues={data}
            drawerProps={{
                destroyOnClose: true,
            }}
        >
            <ProFormText name={'label'} label={'Label'} rules={[{ required: true }]} />
            <ProFormText name={'value'} label={'Value'} rules={[{ required: true }]} />
            <ProFormText name={'key'} label={'Key'} />
            <ProFormSwitch name={'disabled'} label={'Disabled'} />
        </DrawerForm>
    );
};

export default Upsert;
