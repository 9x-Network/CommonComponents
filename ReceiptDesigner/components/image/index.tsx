import { PictureOutlined } from '@ant-design/icons';
import type { ComponentDeclare } from '../../interface';
import Property from './property';
import View from './view';

export type ImageComponent = ComponentDeclare<
    'image',
    {
        align: 'start' | 'center' | 'end';
    },
    string
>;

const component: ImageComponent = {
    type: 'image',
    name: 'Image',
    icon: <PictureOutlined style={{ color: '#84db70' }} />,
    defaultAttrs: {
        align: 'center',
    },
    Property,
    View,
};
export default component;
