import { FontSizeOutlined } from '@ant-design/icons';
import type { ComponentDeclare } from '../../interface';
import Property from './property';
import View from './view';

export type TextComponent = ComponentDeclare<
    'text',
    {
        size: 's' | 'm' | 'l';
        align: 'left' | 'center' | 'right';
        bold?: boolean;
        italic?: boolean;
        mappings?: Record<string, string | number>;
        visibility?: 'always' | 'whenVariablesNotEmpty';
    },
    string
>;

const component: TextComponent = {
    type: 'text',
    name: 'Text',
    icon: <FontSizeOutlined style={{ color: '#8b70db' }} />,
    defaultAttrs: {
        align: 'center',
        size: 'm',
    },
    defaultContent: 'Add your text',
    Property,
    View,
};
export default component;
