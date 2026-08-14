import { Popover, Slider } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';
import CircleCursor from '../CircleCursor';
import fabric from '../fabric';
import iconEraser from '../icons/eraser.svg';
import type { MenuProps } from './index';

const Eraser = (props: MenuProps) => {
    const { canvas, isDrawingMode } = props;
    const { formatMessage } = useIntl();
    const [isEraserMode, setIsEraserMode] = useState<boolean>(
        canvas.freeDrawingBrush.type === 'eraser',
    );
    const [eraserSize, setEraserSize] = useState<number>(10);
    const activeMode = isDrawingMode && isEraserMode;

    useEffect(() => {
        canvas.freeDrawingBrush.width = eraserSize;
    }, [eraserSize]);

    useEffect(() => {
        const onOptionChange = ({ value }: fabric.IEvent<fabric.FreeDrawingBrush>) => {
            setIsEraserMode(value.type === 'eraser');
        };
        canvas.on('brush-changed', onOptionChange);
        return () => {
            canvas.off('brush-changed', onOptionChange);
        };
    }, []);
    return (
        <div className={'inline'} id={'drawingPad-menu-eraser_container'}>
            <Popover
                trigger={['contextMenu']}
                getPopupContainer={() =>
                    document.getElementById('drawingPad-menu-eraser_container')!
                }
                content={
                    <div>
                        <div className={'drawingpad-contextmenu_line'}>
                            <label>
                                {formatMessage({ id: 'component.drawingPad.menu.eraser.size' })}
                            </label>
                            <Slider
                                style={{ width: 200 }}
                                min={1}
                                max={100}
                                value={eraserSize}
                                onChange={setEraserSize}
                            />
                        </div>
                    </div>
                }
                placement={'bottomLeft'}
            >
                <div
                    className={classNames('drawingpad-menu_act', {
                        'drawingpad-menu_act_pressed': activeMode,
                    })}
                    onClick={() => {
                        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
                        canvas.freeDrawingBrush.width = eraserSize;
                        canvas.isDrawingMode = true;
                    }}
                >
                    <img src={iconEraser} draggable={false} />
                </div>
            </Popover>
            {activeMode && <CircleCursor canvas={canvas} size={eraserSize} />}
        </div>
    );
};

export default Eraser;
