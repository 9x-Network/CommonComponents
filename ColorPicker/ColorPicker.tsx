import type { ColorPickerProps as AntdColorPickerProps } from 'antd';
import { ColorPicker as AntdColorPicker } from 'antd';
import { useMemo } from 'react';

export interface ColorPickerProps
    extends Omit<AntdColorPickerProps, 'value' | 'defaultValue' | 'onChange'> {
    value?: string;
    defaultValue?: string;
    onChange?: (value?: string) => void;
}
const ColorPicker = (props: ColorPickerProps) => {
    const { onChange, value, defaultValue, defaultFormat = 'rgb', ...restProps } = props;
    const safeValue = useMemo(() => {
        if (null != value && typeof value !== 'string') return undefined;
        return value;
    }, [value]);
    const safeDefaultValue = useMemo(() => {
        if (null != value && typeof value !== 'string') return undefined;
        return defaultValue;
    }, [defaultValue]);
    return (
        <AntdColorPicker
            defaultFormat={defaultFormat}
            defaultValue={safeDefaultValue}
            value={safeValue}
            format={'hex'}
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

export default ColorPicker;
