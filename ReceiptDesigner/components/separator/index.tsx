import { ColumnHeightOutlined } from '@ant-design/icons';
import type { ComponentDeclare } from '../../interface';
import Property from './property';
import View from './view';

export type SeparatorComponent = ComponentDeclare<
    'separator',
    {
        size: 's' | 'm' | 'l';
        appearance: 'blank-line' | 'solid-line' | 'dotted-line';
    },
    null
>;

const component: SeparatorComponent = {
    type: 'separator',
    name: 'Separator',
    icon: <ColumnHeightOutlined style={{ color: '#dba970' }} />,
    defaultAttrs: {
        size: 's',
        appearance: 'solid-line',
    },
    Property,
    View,
};
export default component;
