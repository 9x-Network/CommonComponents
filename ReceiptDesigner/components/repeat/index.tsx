import { FileSyncOutlined } from '@ant-design/icons';
import type { Component, ComponentDeclare } from '../../interface';
import Property from './property';
import View from './view';

export type RepeatComponent = ComponentDeclare<
    'repeat',
    {
        source?: string;
        itemName?: string;
        indexName?: string;
    },
    Component[] | undefined
>;

const component: RepeatComponent = {
    type: 'repeat',
    name: 'Repeat',
    icon: <FileSyncOutlined style={{ color: '#39add0' }} />,
    Property,
    View,
    isContainer: true,
    isVirtualTag: true,
};
export default component;
