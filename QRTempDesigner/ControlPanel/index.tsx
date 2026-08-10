import { useEffect, useState } from 'react';
import type fabric from '../fabric';
import General from './general';
import Layers from './layers';
import Layout from './layout';
import Qr from './qr';
import Text from './text';

export interface ControllerProps {
    canvas: fabric.Canvas;
}

const ControllerPanel = (props: ControllerProps) => {
    const { canvas } = props;
    const [active, setActive] = useState<fabric.Object | null>(canvas.getActiveObject());
    useEffect(() => {
        const onSelection = () => {
            setActive(canvas.getActiveObject());
        };
        const onSelectionCleared = () => {
            setActive(null);
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

    return (
        <div className={'drawingpad-controller'}>
            <div className={'drawingpad-controller_form'}>
                {active && (
                    <>
                        <General canvas={canvas} active={active} />
                        <Layout canvas={canvas} active={active} />
                        <Text canvas={canvas} active={active} />
                        <Qr canvas={canvas} active={active} />
                    </>
                )}
            </div>
            <Layers canvas={canvas} active={active} />
        </div>
    );
};

export default ControllerPanel;
