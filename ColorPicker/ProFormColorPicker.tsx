import ProForm, { ProFormItemProps } from '@ant-design/pro-form';
import { useMemo } from 'react';
import ColorPicker, { ColorPickerProps } from './ColorPicker';

export interface ProFormColorPickerProps extends Omit<ProFormItemProps, 'children'> {
    fieldProps?: ColorPickerProps;
    initialValue?: string;
    onChange?: (value?: string) => void;
}
const ProFormColorPicker = (props: ProFormColorPickerProps) => {
    const { fieldProps, onChange, initialValue, ...restProps } = props;
    const safeInitialValue = useMemo(() => {
        if (null != initialValue && typeof initialValue !== 'string') return undefined;
        return initialValue;
    }, [initialValue]);
    return (
        <ProForm.Item initialValue={safeInitialValue} {...restProps}>
            <ColorPicker
                {...fieldProps}
                onChange={(value) => {
                    fieldProps?.onChange?.(value);
                    onChange?.(value);
                }}
            />
        </ProForm.Item>
    );
};

export default ProFormColorPicker;
