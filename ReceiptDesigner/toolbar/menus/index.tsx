import type React from 'react';
import Export from './export';
import FontFamily from './FontFamily';
import FontScale from './FontScale';
import Import from './import';
import XMLView from './XMLView';

export type ToolbarMenuItem = React.FC<
    React.PropsWithChildren<
        React.PropsWithChildren<{
            disabled?: boolean;
            lang: string;
        }>
    >
>;
const menus: Record<string, ToolbarMenuItem> = {
    fontFamily: FontFamily,
    fontScale: FontScale,
    xmlView: XMLView,
    import: Import,
    export: Export,
};

export default menus;
