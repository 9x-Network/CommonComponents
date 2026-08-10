import { InputNumber, Slider } from 'antd';
import { useEffect, useState } from 'react';
import { fabric } from '../fabric/fabric';

export interface GeneralProps {
    canvas: fabric.Canvas;
    active: fabric.Object;
}

const General = ({ active, canvas }: GeneralProps) => {
    const defaultColor = 'rgb(0,0,0)';
    const [stroke, setStroke] = useState<string | undefined>(active.get('stroke') || defaultColor);
    const [shadowColor, setShadowColor] = useState<string | undefined>(
        active.get('stroke') || defaultColor,
    );
    const [x, setX] = useState<number | undefined>(active.left);
    const [y, setY] = useState<number | undefined>(active.top);
    const [skewX, setSkewX] = useState<number | undefined>(active.skewX);
    const [skewY, setSkewY] = useState<number | undefined>(active.skewY);
    const [width, setWidth] = useState<number | undefined>(active.width);
    const [height, setHeight] = useState<number | undefined>(active.height);
    const [scaleWidth, setScaleWidth] = useState<number | undefined>(active.getScaledWidth());
    const [scaleHeight, setScaleHeight] = useState<number | undefined>(active.getScaledHeight());

    const isMulti = ['group', 'activeSelection'].includes(active.type || '');

    const onObjectChange = () => {
        setX(active.left);
        setY(active.top);
        setWidth(active.width);
        setHeight(active.height);
        setScaleWidth(active.getScaledWidth());
        setScaleHeight(active.getScaledHeight());
        setHeight(active.height);
        setSkewX(active.skewX);
        setSkewY(active.skewY);
    };

    useEffect(() => {
        setStroke(active.get('stroke') || defaultColor);
        setShadowColor((active.shadow as fabric.Shadow)?.color || defaultColor);
        active.on('moved', onObjectChange);
        active.on('scaled', onObjectChange);
        return () => {
            active.off('moved', onObjectChange);
            active.off('scaled', onObjectChange);
        };
    }, []);
    useEffect(() => {
        onObjectChange();
    }, [active]);

    return (
        <>
            {!isMulti && (
                <>
                    <div>
                        <label>Scale</label>
                        <div>
                            <span className={'drawingpad-controller_sublabel'}>W.</span>
                            <InputNumber
                                value={scaleWidth}
                                style={{ width: 76 }}
                                min={0}
                                onChange={(v) => {
                                    setScaleWidth(v!);
                                    active.scaleToWidth(v!);
                                    canvas.renderAll();
                                    onObjectChange();
                                }}
                            />
                            <span className={'drawingpad-controller_sublabel'}>H.</span>
                            <InputNumber
                                value={scaleHeight}
                                style={{ width: 76 }}
                                min={0}
                                onChange={(v) => {
                                    setScaleHeight(v!);
                                    active.scaleToHeight(v!);
                                    canvas.renderAll();
                                    onObjectChange();
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Layer Size</label>
                        <div>
                            <span className={'drawingpad-controller_sublabel'}>W.</span>
                            <InputNumber
                                value={width}
                                style={{ width: 76 }}
                                min={0}
                                onChange={(v) => {
                                    setWidth(v!);
                                    active.set('width', v!);
                                    canvas.renderAll();
                                }}
                            />
                            <span className={'drawingpad-controller_sublabel'}>H.</span>
                            <InputNumber
                                value={height}
                                style={{ width: 76 }}
                                min={0}
                                onChange={(v) => {
                                    setHeight(v!);
                                    active.set('height', v!);
                                    canvas.renderAll();
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Position</label>
                        <div>
                            <span className={'drawingpad-controller_sublabel'}>X</span>
                            <InputNumber
                                value={x}
                                onChange={(v) => {
                                    if (v === null) return;
                                    v = parseInt(v.toString(), 10);
                                    setX(v);
                                    active.set('left', v);
                                    canvas.renderAll();
                                }}
                            />
                            <span className={'drawingpad-controller_sublabel'}>Y</span>
                            <InputNumber
                                value={y}
                                onChange={(v) => {
                                    if (v === null) return;
                                    v = parseInt(v.toString(), 10);
                                    setY(v);
                                    active.set('top', v);
                                    canvas.renderAll();
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Skew</label>
                        <div>
                            <span className={'drawingpad-controller_sublabel'}>X</span>
                            <InputNumber
                                value={skewX}
                                onChange={(v) => {
                                    if (v === null) return;
                                    v = parseInt(v.toString(), 10);
                                    setSkewX(v);
                                    active.set('skewX', v);
                                    canvas.renderAll();
                                }}
                            />
                            <span className={'drawingpad-controller_sublabel'}>Y</span>
                            <InputNumber
                                value={skewY}
                                onChange={(v) => {
                                    if (v === null) return;
                                    v = parseInt(v.toString(), 10);
                                    setSkewY(v);
                                    active.set('skewY', v);
                                    canvas.renderAll();
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Border Width</label>
                        <Slider
                            style={{ width: 200 }}
                            defaultValue={active.get('strokeWidth')}
                            onChange={(v) => {
                                active.set('strokeWidth', v);
                                canvas.renderAll();
                            }}
                        />
                    </div>
                    <div>
                        <label>Border Color</label>
                        <input
                            type={'color'}
                            value={stroke}
                            className={'drawingpad-controller_colorpicker'}
                            onChange={(evt) => {
                                const color = evt.currentTarget.value;
                                active.set('stroke', color);
                                canvas.renderAll();
                                setStroke(color);
                            }}
                        />
                    </div>
                </>
            )}
            <div>
                <label>Shadow Width</label>
                <Slider
                    style={{ width: 200 }}
                    defaultValue={(active.shadow as fabric.Shadow)?.blur || 0}
                    onChange={(v) => {
                        if (!active.shadow) {
                            active.shadow = new fabric.Shadow({
                                affectStroke: true,
                                color: shadowColor,
                                blur: v,
                            });
                        }
                        (active.shadow as fabric.Shadow).blur = v;
                        canvas.renderAll();
                    }}
                />
            </div>
            <div>
                <label>Shadow Color</label>
                <input
                    type={'color'}
                    value={shadowColor}
                    className={'drawingpad-controller_colorpicker'}
                    onChange={(evt) => {
                        const color = evt.currentTarget.value;
                        if (!active.shadow) return;
                        (active.shadow as fabric.Shadow).color = color;
                        canvas.renderAll();
                        setShadowColor(color);
                    }}
                />
            </div>
            <div>
                <label>Shadow Offset</label>
                <div>
                    <span className={'drawingpad-controller_sublabel'}>X</span>
                    <InputNumber
                        style={{ width: 80 }}
                        defaultValue={(active.shadow as fabric.Shadow)?.offsetX || 0}
                        onChange={(v) => {
                            if (!active.shadow) return;
                            (active.shadow as fabric.Shadow).offsetX = v!;
                            canvas.renderAll();
                        }}
                    />
                    <span className={'drawingpad-controller_sublabel'}>Y</span>
                    <InputNumber
                        style={{ width: 80 }}
                        defaultValue={(active.shadow as fabric.Shadow)?.offsetY || 0}
                        onChange={(v) => {
                            if (!active.shadow) return;
                            (active.shadow as fabric.Shadow).offsetY = v!;
                            canvas.renderAll();
                        }}
                    />
                </div>
            </div>
            <div>
                <label>Opacity</label>
                <Slider
                    style={{ width: 200 }}
                    defaultValue={(1 - (active.get('opacity') || 0)) * 100}
                    onChange={(v) => {
                        active.set('opacity', 1 - v / 100);
                        canvas.renderAll();
                    }}
                />
            </div>
        </>
    );
};

export default General;
