import { useIntl } from '@umijs/max';
import { Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import { fabric } from '../fabric/fabric';
import iconFill from '../icons/fill.svg';
import type { MenuProps } from './index';

const Fill = (props: MenuProps) => {
    const { canvas } = props;
    const { formatMessage } = useIntl();
    const [hasSelection, setHasSelection] = useState<boolean>(false);

    useEffect(() => {
        const onSelection = () => {
            setHasSelection(true);
        };
        const onSelectionCleared = () => {
            setHasSelection(false);
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

    const fill = (method: string) => {
        if (method === 'bg') {
            canvas.setBackgroundColor(canvas.freeDrawingBrush.color, () => {
                canvas.renderAll();
                canvas.fire('bg:changed');
            });
        } else {
            const objects = canvas.getActiveObjects();
            objects.forEach((item) => {
                if (item instanceof fabric.Text) {
                    item.set('backgroundColor', canvas.freeDrawingBrush.color);
                } else {
                    item.set('fill', canvas.freeDrawingBrush.color);
                }
            });
            canvas.renderAll();
            canvas.fire('object:filled');
        }
    };

    return (
        <div className={'inline'} id={'drawingPad-menu-fill_container'}>
            <Dropdown
                trigger={['click']}
                getPopupContainer={() => document.getElementById('drawingPad-menu-fill_container')!}
                menu={{
                    items: [
                        {
                            key: 'bg',
                            label: formatMessage({ id: 'component.drawingPad.menu.fill.fillBg' }),
                        },
                        {
                            key: 'layer',
                            disabled: !hasSelection,
                            label: formatMessage({
                                id: 'component.drawingPad.menu.fill.fillLayer',
                            }),
                        },
                    ],
                    onClick: ({ key }) => fill(key),
                }}
            >
                <div className={'drawingpad-menu_act'}>
                    <img src={iconFill} draggable={false} />
                </div>
            </Dropdown>
        </div>
    );
};

export default Fill;
