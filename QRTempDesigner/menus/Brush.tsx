import { Dropdown, Slider } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from '@umijs/max';
import CircleCursor from '../CircleCursor';
import Contextmenu from '../Contextmenu';
import fabric from '../fabric';
import iconPencil from '../icons/brush.svg';
import iconCircle from '../icons/circle.svg';
import iconDiamond from '../icons/diamond.svg';
import iconSpray from '../icons/spray.svg';
import iconSquare from '../icons/square.svg';
import type { MenuProps } from './index';

export type BrushType = 'pencil' | 'circle' | 'square' | 'diamond' | 'spray';

const brushTypes = [
    { name: 'pencil', icon: iconPencil },
    { name: 'circle', icon: iconCircle },
    { name: 'square', icon: iconSquare },
    { name: 'diamond', icon: iconDiamond },
    { name: 'spray', icon: iconSpray },
];

const GrabMode = (props: MenuProps) => {
    const { canvas, isDrawingMode } = props;
    const { formatMessage } = useIntl();
    // 忽略橡皮擦笔刷
    const [isBrushMode, setIsBrushMode] = useState<boolean>(
        canvas.freeDrawingBrush.type !== 'eraser',
    );
    const [brushSize, setBrushSize] = useState<number>(1);
    const [brushShadowColor, setBrushShadowColor] = useState<string>('#000');
    const [brushShadowWidth, setBrushShadowWidth] = useState<number>(0);
    const [brushShadowOffset, setBrushShadowOffset] = useState<number>(0);
    const [brushType, setBrushType] = useState<BrushType>('pencil');
    const activeMode = isDrawingMode && isBrushMode;

    const updateBrush = () => {
        canvas.freeDrawingBrush.width = brushSize;
        if (brushShadowWidth > 0) {
            if (!canvas.freeDrawingBrush.shadow) {
                canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                    affectStroke: true,
                });
            }
            if (typeof canvas.freeDrawingBrush.shadow === 'object') {
                canvas.freeDrawingBrush.shadow.offsetX = brushShadowOffset;
                canvas.freeDrawingBrush.shadow.offsetY = brushShadowOffset;
                canvas.freeDrawingBrush.shadow.color = brushShadowColor;
                canvas.freeDrawingBrush.shadow.blur = parseInt(`${brushShadowWidth}`, 10) || 0;
            }
        } else {
            canvas.freeDrawingBrush.shadow = undefined;
        }
    };

    useEffect(() => {
        updateBrush();
    }, [brushSize, brushShadowColor, brushShadowWidth, brushShadowOffset]);

    useEffect(() => {
        const onOptionChange = ({ value }: fabric.IEvent<fabric.FreeDrawingBrush>) => {
            setIsBrushMode(value.type !== 'eraser');
        };
        canvas.on('brush-changed', onOptionChange);
        return () => {
            canvas.off('brush-changed', onOptionChange);
        };
    }, []);

    const createSquareBrush = useCallback(() => {
        const squarePatternBrush = new fabric.PatternBrush(canvas);
        squarePatternBrush.getPatternSrc = () => {
            const squareWidth = 10;
            const squareDistance = 2;
            const patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            const ctx = patternCanvas.getContext('2d');
            ctx.fillRect(0, 0, squareWidth, squareWidth);
            return patternCanvas;
        };
        return squarePatternBrush;
    }, []);

    const createDiamondBrush = useCallback(() => {
        const squarePatternBrush = new fabric.PatternBrush(canvas);
        squarePatternBrush.getPatternSrc = () => {
            const squareWidth = 10;
            const squareDistance = 5;
            const patternCanvas = fabric.document.createElement('canvas');
            const rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
            });
            const canvasWidth = rect.getBoundingRect().width;
            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });
            const ctx = patternCanvas.getContext('2d');
            rect.render(ctx);
            return patternCanvas;
        };
        return squarePatternBrush;
    }, []);

    const activeBrush = (type: BrushType = 'pencil') => {
        canvas.discardActiveObject();
        const curColor = canvas.freeDrawingBrush.color;
        switch (type) {
            case 'pencil':
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                break;
            case 'circle':
                canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
                break;
            case 'square':
                canvas.freeDrawingBrush = createSquareBrush();
                break;
            case 'diamond':
                canvas.freeDrawingBrush = createDiamondBrush();
                break;
            case 'spray':
                canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
                break;
            default:
                break;
        }
        canvas.freeDrawingBrush.type = type;
        canvas.freeDrawingBrush.color = curColor;
        if (canvas.freeDrawingBrush.getPatternSrc) {
            canvas.freeDrawingBrush.source = canvas.freeDrawingBrush.getPatternSrc.call(
                canvas.freeDrawingBrush,
            );
        }
        if (!isDrawingMode) {
            canvas.isDrawingMode = true;
        }
        updateBrush();
        setBrushType(type);
    };

    const currentBrush = useMemo(() => {
        const brush = brushTypes.find((item) => item.name === brushType);
        if (!brush) return null;
        return <img draggable={false} src={brush.icon} />;
    }, [brushType]);

    return (
        <div className={'inline'} id={'drawingPad-menu-brush_container'}>
            <Dropdown
                trigger={['contextMenu']}
                getPopupContainer={() =>
                    document.getElementById('drawingPad-menu-brush_container')!
                }
                menu={{
                    items: brushTypes.map((item) => (
                        {
                            key: item.name,
                            icon: (<img src={item.icon} />),
                            classNames: 'drawingpad-menu_act_brush_type',
                        }
                    ))
                }}
            >
                <div
                    className={classNames('drawingpad-menu_act', 'drawingpad-menu_act_hasmore', {
                        'drawingpad-menu_act_pressed': activeMode,
                    })}
                    onClick={() => activeBrush()}
                    onContextMenu={() => {
                        if (!activeMode) activeBrush();
                    }}
                >
                    {currentBrush}
                </div>
            </Dropdown>
            {activeMode && (
                <>
                    <CircleCursor canvas={canvas} size={brushSize} />
                    <Contextmenu canvas={canvas}>
                        <div style={{ padding: 12 }}>
                            <div className={'drawingpad-contextmenu_line'}>
                                <label>
                                    {formatMessage({ id: 'component.drawingPad.menu.brush.size' })}
                                </label>
                                <Slider
                                    style={{ width: 200 }}
                                    min={1}
                                    max={100}
                                    value={brushSize}
                                    onChange={setBrushSize}
                                />
                            </div>
                            <div className={'drawingpad-contextmenu_line'}>
                                <label>
                                    {formatMessage({
                                        id: 'component.drawingPad.menu.brush.shadow.width',
                                    })}
                                </label>
                                <Slider
                                    style={{ width: 200 }}
                                    min={0}
                                    max={50}
                                    value={brushShadowWidth}
                                    onChange={setBrushShadowWidth}
                                />
                            </div>
                            <div className={'drawingpad-contextmenu_line'}>
                                <label>
                                    {formatMessage({
                                        id: 'component.drawingPad.menu.brush.shadow.offset',
                                    })}
                                </label>
                                <Slider
                                    style={{ width: 200 }}
                                    min={0}
                                    max={50}
                                    value={brushShadowOffset}
                                    onChange={setBrushShadowOffset}
                                />
                            </div>
                            <div className={'drawingpad-contextmenu_line'}>
                                <label>
                                    {formatMessage({
                                        id: 'component.drawingPad.menu.brush.shadow.color',
                                    })}
                                </label>
                                <div>
                                    <input
                                        type={'color'}
                                        className={'drawingpad-colorpicker'}
                                        value={brushShadowColor}
                                        onChange={(evt) => {
                                            setBrushShadowColor(evt.currentTarget.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Contextmenu>
                </>
            )}
        </div>
    );
};

export default GrabMode;
