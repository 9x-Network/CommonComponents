import { useForceUpdate } from '@/utils/hooks/forceUpdate';
import { parseJSONSafety } from '@/utils/utils';
import { Col, Row } from 'antd';
import classNames from 'classnames';
import template from 'lodash/template';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ControlPanel from './ControlPanel';
import fabric from './fabric';
import Menus from './menus';
import { customRender } from './menus/QRArea';
import './style.less';

export interface QRTempDesignerProps {
    width?: number;
    height?: number;
    id?: string;
    canvasClassName?: string;
    canvasStyle?: React.CSSProperties;
    containerClassName?: string;
    containerStyle?: React.CSSProperties;
    actions?: React.ReactNode[];
}

const QRTempDesigner = React.forwardRef((props: QRTempDesignerProps, ref) => {
    const {
        width = 800,
        height = 300,
        id,
        canvasClassName,
        canvasStyle,
        containerClassName,
        containerStyle,
    } = props;

    const containerRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = useRef<fabric.Canvas>();
    const forceUpdate = useForceUpdate();
    const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);

    useImperativeHandle(
        ref,
        () => {
            // eslint-disable-next-line no-multi-assign
            const canvas = (canvasRef.current = new fabric.Canvas(containerRef.current, {
                width,
                height,
                fireRightClick: true,
                stopContextMenu: true,
                backgroundColor: '#fff',
            }));
            setIsDrawingMode(!!canvas.isDrawingMode);
            extendsCanvas(canvas);
            extendEvents(canvas);
            forceUpdate();
            return canvasRef.current;
        },
        [containerRef],
    );

    useEffect(() => {
        const onDrawingModeChange = ({ value }: fabric.IEvent) => {
            setIsDrawingMode(value);
        };
        canvasRef.current?.on('drawingmode-changed', onDrawingModeChange);
        return () => {
            canvasRef.current?.off('drawingmode-changed', onDrawingModeChange);
        };
    }, []);

    useEffect(() => {
        const onKeyPress = (evt: KeyboardEvent) => {
            const fabricIns = canvasRef.current;
            if (!fabricIns) return;
            if (evt.code === 'Delete') {
                fabricIns.getActiveObjects().forEach((item) => {
                    fabricIns.remove(item);
                });
                fabricIns.discardActiveObject();
            }
        };
        window.addEventListener('keyup', onKeyPress);
        return () => {
            window.removeEventListener('keyup', onKeyPress);
        };
    }, []);

    return (
        <div
            className={classNames(containerClassName, 'drawingpad-container')}
            style={containerStyle}
        >
            {canvasRef.current && (
                <Menus
                    canvas={canvasRef.current}
                    isDrawingMode={isDrawingMode}
                    actions={props.actions}
                />
            )}
            <Row className={'drawingpad-workpad'} gutter={12}>
                <Col className={'drawingpad-canvas_box'}>
                    <canvas
                        id={id}
                        className={canvasClassName}
                        style={canvasStyle}
                        ref={containerRef}
                    />
                </Col>
                <Col>{canvasRef.current && <ControlPanel canvas={canvasRef.current} />}</Col>
            </Row>
        </div>
    );
});

function extendsCanvas(canvas: fabric.Canvas) {
    const { toJSON, loadFromJSON } = canvas;
    canvas.toJSON = (
        propertiesToInclude: string[] = [
            'name',
            'selectable',
            'type',
            'customType',
            'extraContent',
        ],
    ) => {
        return toJSON.call(canvas, propertiesToInclude);
    };
    canvas.loadFromJSON = (json: any, callback: () => void, reviver?: (...args: any[]) => void) => {
        return loadFromJSON.call(canvas, json, callback, (data: any, obj: fabric.Object) => {
            obj.customType = data.customType;
            obj.extraContent = data.extraContent;
            if (obj.customType === 'qr') {
                customRender(obj as fabric.Image, canvas)();
            }
            reviver?.(data, obj);
        });
    };
}

function extendEvents(canvas: fabric.Canvas) {
    let { isDrawingMode, freeDrawingBrush } = canvas;
    Object.defineProperty(canvas, 'isDrawingMode', {
        get: () => {
            return isDrawingMode;
        },
        set: (flag: boolean) => {
            isDrawingMode = flag;
            canvas.fire('drawingmode-changed', { value: flag });
        },
    });
    Object.defineProperty(canvas, 'freeDrawingBrush', {
        get: () => {
            return freeDrawingBrush;
        },
        set: (brush: fabric.FreeDrawingBrush) => {
            freeDrawingBrush = brush;
            canvas.fire('brush-changed', { value: brush });
        },
    });
}

type QRTempDesignerWidthStaticMethods = typeof QRTempDesigner & {
    generateQR: (
        content: Record<any, any>,
        scope: Record<string, any>,
        meta: { width: number; height: number; [key: string]: any },
    ) => Promise<string>;
};

(QRTempDesigner as QRTempDesignerWidthStaticMethods).generateQR = async (content, scope, meta) => {
    return new Promise((resolve) => {
        const canvasEl = document.createElement('canvas');
        const canvas = new fabric.Canvas(canvasEl, {
            width: meta.width,
            height: meta.height,
        });
        extendsCanvas(canvas);
        canvas.loadFromJSON(content, () => {
            canvas.getObjects().forEach((obj) => {
                if (obj.type === 'text' || obj.type === 'textbox') {
                    if (obj.text) {
                        const compiled = template(obj.text, {
                            interpolate: /{([\s\S]+?)}/g,
                        });
                        const evaledText = compiled(scope);
                        obj.set('text', evaledText);
                    }
                } else if (obj.customType === 'qr' && obj.extraContent) {
                    const opts = parseJSONSafety(obj.extraContent);
                    if (!opts || opts.content !== 'qr://merchant_receiving') return;
                    opts.content = scope.$merchant_receiving;
                    obj.extraContent = JSON.stringify(opts);
                }
            });
            canvas.renderAll();
            setTimeout(() => {
                const dataUrl = canvas.toDataURL({
                    quality: 1,
                });
                resolve(dataUrl);
            }, 500);
        });
    });
};

export default QRTempDesigner as QRTempDesignerWidthStaticMethods;
