import type { ProFormProps } from '@ant-design/pro-form';
import ProForm, { ModalForm, ProFormField } from '@ant-design/pro-form';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import type { Copy } from '../interface';

export type UpsertValue = Pick<Copy, 'id' | 'name'>;

export type UpsertRef = {
    show: (onFinish?: ProFormProps<UpsertValue>['onFinish'], value?: UpsertValue) => void;
};

const Upsert = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [mode, setMode] = useState<'new' | 'update' | 'copy'>('new');
    const onFinishRef = useRef<ProFormProps<UpsertValue>['onFinish']>();
    const [form] = ProForm.useForm();
    const { formatMessage } = useIntl();

    useImperativeHandle<unknown, UpsertRef>(ref, () => ({
        show: (onFinish, value) => {
            setMode(value ? 'update' : 'new');
            onFinishRef.current = onFinish;
            setVisible(true);
            if (value) {
                form.setFieldsValue(value);
            }
        },
    }));

    return (
        <ModalForm<UpsertValue>
            title={
                mode === 'update'
                    ? formatMessage({ id: 'component.receiptDesigner.copies.form.update' })
                    : formatMessage({ id: 'component.receiptDesigner.copies.form.new' })
            }
            width={460}
            form={form}
            open={visible}
            onFinish={onFinishRef.current as any}
            onOpenChange={setVisible}
        >
            <ProFormField
                label={formatMessage({ id: 'component.receiptDesigner.copies.form.id' })}
                name={'id'}
                rules={[{ required: true }]}
            />
            <ProFormField
                label={formatMessage({ id: 'component.receiptDesigner.copies.form.name' })}
                name={'name'}
                rules={[{ required: true }]}
            />
        </ModalForm>
    );
});

export default Upsert;
