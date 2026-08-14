import { getPublicPath } from '@/utils/utils';
import { Select } from 'antd';
import { useEffect, useRef } from 'react';
import { CommonGeneralSettings } from '@umijs/max';
import { useContextValue } from '../../context';
import type { ToolbarMenuItem } from './index';

export const SupportFonts = CommonGeneralSettings.receiptDesigner.extFonts;

export const FontFamily: ToolbarMenuItem = ({ disabled }) => {
    const { value, setValue } = useContextValue();
    const injectedFonts = useRef<string[]>([]);

    useEffect(() => {
        if (!value?.fontFamily || injectedFonts.current.includes(value.fontFamily)) return;
        const font = SupportFonts.find((n) => n.font === value.fontFamily);
        if (!font) return;
        const style: HTMLStyleElement = document.createElement('style');
        const url = getPublicPath(font.path);
        const code = `
        @font-face {
            font-family: ${value.fontFamily};
            src: url('${url}');
        }
        `;
        style.appendChild(document.createTextNode(code));
        const head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
        injectedFonts.current.push(value.fontFamily);
        console.log('字体库加载完成！', code);
    }, [value]);

    if (!value) return null;
    return (
        <Select
            disabled={disabled || !value}
            style={{ width: 160 }}
            value={value?.fontFamily}
            onChange={(fontFamily) => {
                setValue({ ...value, fontFamily });
            }}
            allowClear
            options={SupportFonts.map((n) => ({
                label: n.name,
                value: n.font,
            }))}
            placeholder={'Font family'}
        />
    );
};

export default FontFamily;
