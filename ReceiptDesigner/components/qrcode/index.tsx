import { QrcodeOutlined } from '@ant-design/icons';
import type { ComponentDeclare } from '../../interface';
import Property from './property';
import View from './view';

export type QRCodeComponent = ComponentDeclare<
    'qrcode',
    {
        align: 'start' | 'center' | 'end';
        size: 's' | 'm' | 'l';
    },
    string
>;

const component: QRCodeComponent = {
    type: 'qrcode',
    name: 'QR code',
    icon: <QrcodeOutlined style={{ color: '#70cbdb' }} />,
    defaultAttrs: {
        align: 'center',
        size: 'm',
    },
    Property,
    View,
};

export default component;
