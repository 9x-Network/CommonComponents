import { parseJSONSafety } from '@/utils/utils';
import { QrcodeOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import qrcode from 'qrcode';
import { useRef } from 'react';
import fabric from '../fabric';
import type { MenuProps } from './index';

const defaultSize = 600;

export const customRender = (qrImage: fabric.Image, canvas: fabric.Canvas) => {
    const originRender = qrImage.render;
    let preOptions = qrImage.extraContent;
    return () => {
        // eslint-disable-next-line func-names
        qrImage.render = function (ctx: CanvasRenderingContext2D) {
            if (!this.extraContent) return;
            if (preOptions === this.extraContent) {
                originRender.call(this, ctx);
                return;
            }
            // option发生变化
            const newOptions = parseJSONSafety(this.extraContent, {});
            qrcode.toDataURL(
                newOptions.content,
                {
                    type: 'image/png',
                    width: this.width,
                    margin: 0,
                    color: {
                        dark: newOptions.dark,
                        light: newOptions.light,
                    },
                },
                (err, url) => {
                    if (err) {
                        message.error('QR generate failed');
                        return;
                    }
                    qrImage.setSrc(url, () => {
                        canvas.renderAll();
                    });
                },
            );
            preOptions = this.extraContent;
        };
    };
};

const QrArea = ({ canvas }: MenuProps) => {
    const qrRef = useRef<fabric.Image | undefined>();

    const insertQr = (text: string) => {
        const qrImage = new fabric.Image();
        qrImage.width = defaultSize;
        qrImage.height = defaultSize;
        qrImage.customType = 'qr';
        const options = { content: text, dark: '#000', light: '#FFF' };
        qrImage.extraContent = JSON.stringify(options);
        qrcode.toDataURL(
            options.content,
            {
                type: 'image/png',
                width: defaultSize,
                margin: 0,
                color: {
                    dark: options.dark,
                    light: options.light,
                },
            },
            (err, url) => {
                if (err) {
                    message.error('QR generate failed');
                    return;
                }
                qrImage.setSrc(url, () => {
                    canvas.renderAll();
                });
            },
        );
        qrImage.scaleToWidth(200);
        customRender(qrImage, canvas)();
        qrRef.current = qrImage;
        canvas.add(qrImage);
    };
    const onMenu = (type: string) => {
        if (type === 'merchant') {
            insertQr('qr://merchant_receiving');
        } else {
            // eslint-disable-next-line no-alert
            const content = prompt('Please enter content');
            if (content) {
                insertQr(content);
            }
        }
    };
    return (
        <div className={'inline'} id={'drawingPad-menu-qr_container'}>
            <Dropdown
                trigger={['click']}
                getPopupContainer={() => document.getElementById('drawingPad-menu-qr_container')!}
                menu={{
                    items: [
                        {
                            key: 'merchant',
                            label: 'Merchant QR',
                        },
                        {
                            key: 'custom',
                            label: 'Custom QR',
                        },
                    ],
                    onClick: ({ key }) => onMenu(key),
                }}
            >
                <div className={'drawingpad-menu_act'}>
                    <QrcodeOutlined />
                </div>
            </Dropdown>
        </div>
    );
};

export default QrArea;
