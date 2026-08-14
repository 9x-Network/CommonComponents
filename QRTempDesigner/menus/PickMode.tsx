import { Menu, Modal } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';
import Contextmenu from '../Contextmenu';
import { fabric } from '../fabric/fabric';
import iconChoose from '../icons/choose.svg';
import type { MenuProps } from './index';

const PickMode = (props: MenuProps) => {
    const { canvas, isDrawingMode } = props;
    const { formatMessage } = useIntl();

    const [selected, setSelected] = useState<fabric.Object[]>([]);

    useEffect(() => {
        const onSelection = () => {
            setSelected(canvas.getActiveObjects());
        };
        const onSelectionCleared = () => {
            setSelected([]);
        };
        canvas.on('selection:created', onSelection);
        canvas.on('selection:updated', onSelection);
        canvas.on('selection:cleared', onSelectionCleared);
        return () => {
            canvas.off('selection:created', onSelection);
            canvas.off('selection:updated', onSelection);
            canvas.off('selection:cleared', onSelectionCleared);
        };
    }, []);

    const onMenu = (act: string) => {
        const activeObject = canvas.getActiveObject();
        switch (act) {
            case 'duplicate':
                canvas.getActiveObject().clone((cloned: any) => {
                    canvas.discardActiveObject();
                    cloned.set({
                        left: cloned.left + 10,
                        top: cloned.top + 10,
                    });
                    canvas.add(cloned);
                });
                break;
            case 'combine':
                if (!activeObject || activeObject.type !== 'activeSelection') {
                    return;
                }
                activeObject.toGroup();
                canvas.requestRenderAll();
                setSelected(canvas.getActiveObjects());
                break;
            case 'uncombine':
                if (!activeObject || activeObject.type !== 'group') {
                    return;
                }
                canvas.getActiveObject().toActiveSelection();
                canvas.requestRenderAll();
                setSelected(canvas.getActiveObjects());
                break;
            case 'delete':
                canvas.discardActiveObject();
                canvas.remove(activeObject);
                break;
            case 'rasterize':
                Modal.confirm({
                    title: 'Are you sure to rasterize selected layer',
                    onOk: () => {
                        const text = canvas.getActiveObject();
                        const data = text.toDataURL({});
                        fabric.Image.fromURL(data, (image) => {
                            image.left = text.left;
                            image.top = text.top;
                            canvas.remove(text);
                            canvas.add(image);
                            canvas.setActiveObject(image);
                        });
                    },
                });
                break;
            default:
                break;
        }
    };
    return (
        <>
            <div
                className={classNames('drawingpad-menu_act', {
                    'drawingpad-menu_act_pressed': !isDrawingMode,
                })}
                onClick={() => {
                    canvas.isDrawingMode = false;
                }}
            >
                <img draggable={false} src={iconChoose} />
            </div>
            {selected.length > 0 && (
                <Contextmenu canvas={canvas} closeIconVisible={false} clickAnywhereToClose>
                    <Menu activeKey={''} onClick={({ key }) => onMenu(key)}>
                        {selected.length === 1 && (
                            <Menu.Item key={'duplicate'}>
                                {formatMessage({
                                    id: 'component.drawingPad.pick.contextmenu.duplicate',
                                })}
                            </Menu.Item>
                        )}
                        {selected.length > 1 && (
                            <Menu.Item key={'combine'}>
                                {formatMessage({
                                    id: 'component.drawingPad.pick.contextmenu.combine',
                                })}
                            </Menu.Item>
                        )}
                        {selected.length === 1 && (
                            <>
                                {selected[0]?.type === 'group' && (
                                    <Menu.Item key={'uncombine'}>
                                        {formatMessage({
                                            id: 'component.drawingPad.pick.contextmenu.uncombine',
                                        })}
                                    </Menu.Item>
                                )}
                                {selected[0]?.type === 'textbox' && (
                                    <Menu.Item key={'rasterize'}>Rasterize</Menu.Item>
                                )}
                                <Menu.Item key={'delete'}>
                                    {formatMessage({
                                        id: 'component.drawingPad.pick.contextmenu.delete',
                                    })}
                                </Menu.Item>
                            </>
                        )}
                    </Menu>
                </Contextmenu>
            )}
        </>
    );
};

export default PickMode;
