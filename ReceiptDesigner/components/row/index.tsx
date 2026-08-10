import { OneToOneOutlined } from '@ant-design/icons';
import type { Component, ComponentDeclare } from '../../interface';
import Property from './property';
import View from './view';

export type RowComponent = ComponentDeclare<
    'row',
    {
        spaceBetween?: boolean;
        visibility?: 'always' | 'whenVariablesNotEmpty';
        gap?: number;
    },
    Component[] | undefined
>;

const component: RowComponent = {
    type: 'row',
    name: 'Row',
    icon: <OneToOneOutlined style={{ color: '#516ddc' }} />,
    defaultAttrs: {
        visibility: 'always',
    },
    Property,
    View,
    isContainer: true,
};
export default component;
