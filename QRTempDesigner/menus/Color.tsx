import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import type { MenuProps } from './index';

const GrabMode = (props: MenuProps) => {
    const { canvas } = props;

    const [color, setColor] = useState<string>(canvas.freeDrawingBrush.color);
    const [spareColor, setSpareColor] = useState<string>('#ffffff');

    useEffect(() => {
        canvas.freeDrawingBrush.color = color;
        canvas.fire('color-changed', { value: { color, spareColor } });
    }, [color]);

    const onContextMenu = (evt: MouseEvent<HTMLDivElement>) => {
        evt.preventDefault();
        const temp = spareColor;
        setSpareColor(color);
        setColor(temp);
    };

    return (
        <div className={'drawingpad-menu_act'} onContextMenu={onContextMenu}>
            <div className={'drawingpad-menu_act_colorpicker_container'}>
                <input
                    type={'color'}
                    className={'drawingpad-colorpicker drawingpad-menu_act_colorpicker'}
                    value={color}
                    onChange={(evt) => {
                        setColor(evt.currentTarget.value);
                    }}
                />
                <input
                    type={'color'}
                    className={
                        'drawingpad-colorpicker drawingpad-menu_act_colorpicker drawingpad-menu_act_colorpicker_spare'
                    }
                    value={spareColor}
                    onChange={(evt) => {
                        setSpareColor(evt.currentTarget.value);
                    }}
                />
            </div>
        </div>
    );
};

export default GrabMode;
