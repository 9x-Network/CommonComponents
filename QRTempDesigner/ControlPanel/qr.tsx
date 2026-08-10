import { parseJSONSafety } from '@/utils/utils';
import { useEffect, useState } from 'react';
import type fabric from '../fabric';

export interface QRProps {
    canvas: fabric.Canvas;
    active: fabric.Object;
}

const Qr = ({ active, canvas }: QRProps) => {
    const [qrColor, setQRColor] = useState<string | undefined>();
    const [qrBgColor, setQRBgColor] = useState<string | undefined>();

    useEffect(() => {
        if (active.customType === 'qr') {
            const opts = parseJSONSafety(active.extraContent || '');
            if (!opts) return;
            setQRColor(opts.dark);
            setQRBgColor(opts.light);
        }
    }, [active]);

    useEffect(() => {
        if (active.customType !== 'qr') return;
        const opts = parseJSONSafety(active.extraContent || '', {});
        opts.dark = qrColor;
        opts.light = qrBgColor;
        active.extraContent = JSON.stringify(opts);
        canvas.renderAll();
    }, [qrColor, qrBgColor]);

    if (active.customType !== 'qr') return null;
    return (
        <>
            <div>
                <label>QR Dark Color</label>
                <input
                    type={'color'}
                    value={qrColor}
                    className={'drawingpad-controller_colorpicker'}
                    onChange={(evt) => {
                        const color = evt.currentTarget.value;
                        setQRColor(color);
                    }}
                />
            </div>
            <div>
                <label>QR Light Color</label>
                <input
                    type={'color'}
                    value={qrBgColor}
                    className={'drawingpad-controller_colorpicker'}
                    onChange={(evt) => {
                        const color = evt.currentTarget.value;
                        setQRBgColor(color);
                    }}
                />
            </div>
        </>
    );
};

export default Qr;
