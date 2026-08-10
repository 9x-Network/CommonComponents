import { PictureOutlined } from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'umi';
import fabric from '../fabric';
import type { MenuProps } from './index';

const Image = (props: MenuProps) => {
    const { canvas } = props;
    const { formatMessage } = useIntl();
    const [disablePattern, setDisablePattern] = useState<boolean>(true);
    const insertMethod = useRef<string>('');
    const uploadRef = useRef<HTMLInputElement>(null);

    const onImage = (file: File) => {
        const reader = new FileReader();
        reader.onerror = (err) => {
            console.error(err);
        };
        reader.onload = (evt) => {
            const base64: string = evt?.target?.result as string;
            fabric.Image.fromURL(base64, (image) => {
                image.scaleToWidth(Math.min(image.width || 0, canvas.width || 0));
                switch (insertMethod.current) {
                    case 'bg': {
                        canvas.setBackgroundImage(
                            image,
                            () => {
                                canvas.renderAll();
                                canvas.fire('bg:changed');
                            },
                            {
                                top: 0,
                                left: 0,
                                originX: 'left',
                                originY: 'top',
                            },
                        );
                        break;
                    }
                    case 'layer': {
                        canvas.add(image);
                        break;
                    }
                    case 'layer-patterns':
                        {
                            const active = canvas.getActiveObject();
                            if (!active) {
                                Modal.error({
                                    title: 'Please select a object first',
                                });
                                return;
                            }
                            fabric.util.loadImage(base64, (img) => {
                                if (active.type !== 'textbox') {
                                    image.scaleToWidth(active.width || 1, true);
                                }
                                active.set(
                                    'fill',
                                    new fabric.Pattern({
                                        source: img,
                                        repeat: 'repeat',
                                    }),
                                );
                                canvas.renderAll();
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
        };
        reader.readAsDataURL(file);
    };

    const onMenu = (method: string) => {
        insertMethod.current = method;
        uploadRef.current?.click();
    };

    return (
        <div id={'drawingPad-menu-image_container'} className={'inline'}>
            <Dropdown
                trigger={['click']}
                getPopupContainer={() =>
                    document.getElementById('drawingPad-menu-image_container')!
                }
                onOpenChange={(v) => {
                    if (v) {
                        setDisablePattern(!canvas.getActiveObject());
                    }
                }}
                menu={{
                    items: [
                        {
                            key: 'bg',
                            label: formatMessage({ id: 'component.drawingPad.menu.image.insertBg' }),
                        },
                        {
                            key: 'layer',
                            label: formatMessage({ id: 'component.drawingPad.menu.image.insertLayer' }),
                        },
                        {
                            key: 'layer-patterns',
                            label: formatMessage({ id: 'component.drawingPad.menu.image.insertLayerPatterns' }),
                            disabled: disablePattern,
                        },
                    ],
                    onClick: ({ key }) => onMenu(key),
                }}
            >
                <div className={'drawingpad-menu_act'}>
                    <PictureOutlined />
                </div>
            </Dropdown>
            <input
                type={'file'}
                ref={uploadRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.currentTarget?.files?.[0];
                    if (file) {
                        onImage(file);
                        uploadRef.current!.value = '';
                    }
                }}
            />
        </div>
    );
};

export default Image;
