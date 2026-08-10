import { CloseCircleOutlined } from '@ant-design/icons';
import type { PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';
import type fabric from './fabric';

interface ContextmenuProps {
    canvas: fabric.Canvas;
    closeIconVisible?: boolean;
    clickAnywhereToClose?: boolean;
}

function Contextmenu(props: PropsWithChildren<ContextmenuProps>) {
    const { canvas, children, closeIconVisible = true, clickAnywhereToClose = false } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>();
    useEffect(() => {
        const onTouchAnywhere = (evt: MouseEvent) => {
            let canRemove = true;
            if (evt.target && containerRef.current) {
                let parent: HTMLElement | null = evt.target as HTMLElement;
                while (parent) {
                    if (
                        parent === containerRef.current ||
                        parent.id === 'drawingpad-contextMenuPopup'
                    ) {
                        canRemove = false;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
            if (canRemove) {
                setContextMenuPos(undefined);
                document.body.removeEventListener('mousedown', onTouchAnywhere);
            }
        };
        const onContextMenu = (evt: fabric.IEvent) => {
            if (evt.button !== 3) return;
            const e = evt.e as MouseEvent;
            setContextMenuPos({
                x: e.pageX,
                y: e.pageY,
            });
            document.body.addEventListener('mousedown', onTouchAnywhere);
        };
        canvas.on('mouse:up', onContextMenu);
        return () => {
            canvas.off('mouse:up', onContextMenu);
        };
    }, []);
    if (!contextMenuPos) return null;
    return (
        <div
            className={'drawingpad-contextmenu'}
            style={{ position: 'fixed', left: contextMenuPos.x, top: contextMenuPos.y }}
            ref={containerRef}
            onClick={() => {
                if (clickAnywhereToClose) {
                    setContextMenuPos(undefined);
                }
            }}
        >
            {children}
            {closeIconVisible && (
                <CloseCircleOutlined
                    onClick={() => setContextMenuPos(undefined)}
                    className={'drawingpad-contextmenu_close'}
                />
            )}
        </div>
    );
}

export default Contextmenu;
