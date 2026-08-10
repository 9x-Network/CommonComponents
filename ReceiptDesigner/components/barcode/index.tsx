import { BarcodeOutlined } from '@ant-design/icons';
import type { ComponentDeclare } from '../../interface';
import Property from './property';
import View from './view';

export type BarCodeComponent = ComponentDeclare<
    'barcode',
    {
        size: 's' | 'm' | 'l';
        align: 'start' | 'center' | 'end';
    },
    string
>;

const component: BarCodeComponent = {
    type: 'barcode',
    name: 'Barcode',
    icon: <BarcodeOutlined style={{ color: '#7082db' }} />,
    defaultAttrs: {
        size: 'm',
        align: 'center',
    },
    Property,
    View,
};

export default component;
