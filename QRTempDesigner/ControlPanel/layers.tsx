import {
    BorderOutlined,
    EyeOutlined,
    FileImageOutlined,
    FolderViewOutlined,
    FontColorsOutlined,
    LayoutOutlined,
    LineOutlined,
    QrcodeOutlined,
} from '@ant-design/icons';
import { SortableContainer, SortableElement } from '@prma85/react-sortable-hoc';
import { List } from 'antd';
import classnames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import type fabric from '../fabric';

export interface LayersProps {
    canvas: fabric.Canvas;
    active?: fabric.Object | null;
}

const Layers = ({ canvas, active }: LayersProps) => {
    const exclude = ['cursor'];

    function getCanvasObjects() {
        const objects = canvas
            .getObjects()
            .filter((item) => (item.type ? !exclude.includes(item.customType || item.type) : true));
        objects.forEach((item) => {
            if (!item.name)
                item.name = `${item.customType || item.type || ''}${(Math.random() * 10000).toFixed(
                    0,
                )}`;
        });
        return objects;
    }

    const [objects, setObjects] = useState<fabric.Object[]>(getCanvasObjects());

    const reversedObjects = useMemo(() => [...objects].reverse(), [objects]);

    function refreshObjects() {
        setObjects(getCanvasObjects());
    }

    useEffect(() => {
        canvas.on('object:added', refreshObjects);
        canvas.on('object:removed', refreshObjects);
        canvas.on('canvas:cleared', refreshObjects);
        return () => {
            canvas.off('object:added', refreshObjects);
            canvas.off('object:removed', refreshObjects);
            canvas.off('canvas:cleared', refreshObjects);
        };
    }, []);

    const SortableItem = SortableElement<{ item: fabric.Object }>(
        ({ item }: { item: fabric.Object }) => {
            const type = item.customType || item.type;
            const iconMap: Record<string, React.ReactNode> = {
                default: <BorderOutlined />,
                rect: <LayoutOutlined />,
                circle: <LayoutOutlined />,
                triangle: <LayoutOutlined />,
                line: <LayoutOutlined />,
                image: <FileImageOutlined />,
                text: <FontColorsOutlined />,
                textbox: <FontColorsOutlined />,
                qr: <QrcodeOutlined />,
                group: <FolderViewOutlined />,
                path: <LineOutlined />,
            };
            const onNameInput = (evt: React.FormEvent<HTMLDivElement>) => {
                item.name = evt.currentTarget.innerText;
            };
            return (
                <List.Item
                    className={classnames('drawingpad-controller_layers_list_item', {
                        'drawingpad-controller_layers_list_item_active': active === item,
                    })}
                    onClick={() => {
                        canvas.discardActiveObject();
                        canvas.setActiveObject(item);
                        canvas.renderAll();
                    }}
                    actions={[<span key={'del'}>{iconMap[type || 'default']}</span>]}
                >
                    <List.Item.Meta
                        avatar={
                            <div
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    evt.stopPropagation();
                                    canvas.discardActiveObject();
                                    item.visible = !item.visible;
                                    canvas.renderAll();
                                    refreshObjects();
                                }}
                            >
                                {item.visible ? (
                                    <EyeOutlined
                                        className={'drawingpad-controller_layers_list_item_eye'}
                                    />
                                ) : (
                                    <BorderOutlined
                                        className={'drawingpad-controller_layers_list_item_eye'}
                                    />
                                )}
                            </div>
                        }
                        title={
                            <span
                                contentEditable
                                onInput={onNameInput}
                                onKeyDown={(evt) => {
                                    if (evt.keyCode === 13) {
                                        evt.preventDefault();
                                    }
                                }}
                                className={'drawingpad-controller_layers_list_item_title'}
                            >
                                {item.name}
                            </span>
                        }
                    />
                </List.Item>
            );
        },
    );
    const SortableList = SortableContainer<{ items: fabric.Object[] }>(
        ({ items }: { items: fabric.Object[] }) => {
            return (
                <List itemLayout={'horizontal'} className={'drawingpad-controller_layers_list'}>
                    {items.map((item, index) => (
                        <SortableItem key={item.name} index={index} item={item} />
                    ))}
                </List>
            );
        },
    );
    const onSortEnd = ({ oldIndex, newIndex }: any) => {
        objects[objects.length - oldIndex - 1].moveTo(objects.length - newIndex - 1);
        canvas.renderAll();
        refreshObjects();
    };

    if (objects.length <= 0) return null;
    return (
        <div className={'drawingpad-controller_layers'}>
            <SortableList distance={6} items={reversedObjects} onSortEnd={onSortEnd} />
        </div>
    );
};

export default Layers;
