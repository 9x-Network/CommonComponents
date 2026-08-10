import { useEffect, useMemo } from 'react';
import fabric from './fabric';

interface CircleCursorProps {
    canvas: fabric.Canvas;
    size: number;
}

function CircleCursor(props: CircleCursorProps) {
    const { canvas, size } = props;

    const cursor = useMemo(() => {
        const circle = new fabric.Circle({
            radius: size,
            fill: '#fff',
            left: 0,
            stroke: '#ccc',
            strokeWidth: 2,
            opacity: 0.9,
            selectable: false,
            erasable: false,
        });
        circle.customType = 'cursor';
        return circle;
    }, []);

    useEffect(() => {
        const onMouseOver = () => {
            canvas.add(cursor);
        };
        const onMouseMove = (evt: fabric.IEvent) => {
            let hasCursor = false;
            canvas.forEachObject((object) => {
                if (object.customType === 'cursor') {
                    hasCursor = true;
                }
            });
            if (!hasCursor) {
                canvas.add(cursor);
            }
            const x = evt.pointer?.x || 0;
            const y = evt.pointer?.y || 0;
            const cursorSize = cursor.radius || 0;
            cursor.left = x - cursorSize;
            cursor.top = y - cursorSize;
            canvas.renderAll();
        };
        const onMouseOut = () => {
            canvas.remove(cursor);
        };
        canvas.on('mouse:over', onMouseOver);
        canvas.on('mouse:move', onMouseMove);
        canvas.on('mouse:out', onMouseOut);
        return () => {
            canvas.off('mouse:over', onMouseOver);
            canvas.off('mouse:move', onMouseMove);
            canvas.off('mouse:out', onMouseOut);
            canvas.remove(cursor);
        };
    }, []);

    useEffect(() => {
        cursor.set('radius', Math.max(1, size / 2));
    }, [size]);

    return <></>;
}

export default CircleCursor;
