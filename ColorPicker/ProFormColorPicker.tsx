import {
    ProFormColorPicker as AntdProFormColorPicker,
    ProFormColorPickerProps as AntdProFormColorPickerProps,
} from '@ant-design/pro-form';
import { useMemo } from 'react';

export interface ProFormColorPickerProps extends Omit<AntdProFormColorPickerProps, 'initialValue'> {
    initialValue?: string;
    onChange?: (value?: string) => void;
}
const ProFormColorPicker = (props: ProFormColorPickerProps) => {
    const {
        onChange,
        allowClear = true,
        getValueFromEvent = (color) => color.toCssString(),
        initialValue,
        ...restProps
    } = props;
    const safeInitialValue = useMemo(() => {
        if (null != initialValue && typeof initialValue !== 'string') return undefined;
        return initialValue;
    }, [initialValue]);
    return (
        <AntdProFormColorPicker
            allowClear={allowClear}
            initialValue={safeInitialValue}
            getValueFromEvent={getValueFromEvent}
            // @ts-ignore
            onChange={(color, hex) => {
                if (color.cleared) {
                    onChange?.(undefined);
                } else {
                    onChange?.(hex);
                }
            }}
            {...restProps}
        />
    );
};

export default ProFormColorPicker;
