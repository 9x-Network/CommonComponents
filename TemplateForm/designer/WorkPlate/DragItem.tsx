import { useDesignerContext } from '@/components/common/TemplateForm/designer/context';
import type { TemplateConfig } from '@/components/common/TemplateForm/FormItem';
import { arrayMove } from '@dnd-kit/sortable';
import classnames from 'classnames';
import type { Identifier } from 'dnd-core';
import type { MouseEventHandler } from 'react';
import React, { useEffect, useRef } from 'react';
import type { XYCoord } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import type { Component } from '../components';
import useStyles from '../style.style';

export interface DragItemProps {
    data: TemplateConfig;
    className?: string;
    draggable?: boolean;
    onDrop?: (item: Component, template: TemplateConfig) => void;
    onClick?: MouseEventHandler;
    children?: React.ReactNode;
}

const DragItem = (props: DragItemProps) => {
    const { styles } = useStyles();
    const { draggable = true, onDrop, className, children, onClick, data } = props;
    const { value, setValue } = useDesignerContext();
    const container = useRef<HTMLDivElement>(null);
    const record = useRef({ startTime: 0, startX: 0, startY: 0, curX: 0, curY: 0 });

    const [{ itemActive }, componentDrop] = useDrop(
        () => ({
            accept: 'component',
            canDrop: () => draggable,
            drop: (comp: Component) => onDrop?.(comp, data),
            collect: (monitor) => ({
                itemActive: monitor.isOver({ shallow: true }) && monitor.canDrop(),
            }),
        }),
        [value],
    );

    const [{ isDragging }, sortDrag] = useDrag(
        () => ({
            type: 'sort',
            item: data,
            canDrag: draggable,
            options: {
                dropEffect: 'move',
            },
            collect: (monitor: any) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [],
    );

    const [{ handlerId }, sortDrop] = useDrop<
        TemplateConfig,
        void,
        { handlerId: Identifier | null }
    >({
        accept: 'sort',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!container.current || !value) {
                return;
            }
            const dragIndex = value.findIndex((n) => n.name === item.name);
            const hoverIndex = value.findIndex((n) => n.name === data.name);
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = container.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            }
            const sortValue = arrayMove(value, dragIndex, hoverIndex);
            setValue(sortValue);
        },
    });

    useEffect(() => {
        sortDrag(sortDrop(componentDrop(container)));
    }, [container.current]);

    return (
        <div
            className={classnames(className, {
                active: itemActive,
            })}
            style={{
                opacity: isDragging ? 0 : 1,
            }}
            ref={container}
            data-handler-id={handlerId}
            onMouseDown={(evt) => {
                record.current = {
                    startTime: Date.now(),
                    startX: evt.clientX,
                    startY: evt.clientY,
                    curX: evt.clientX,
                    curY: evt.clientY,
                };
            }}
            onMouseMove={(evt) => {
                record.current.curX = evt.clientX;
                record.current.curY = evt.clientY;
            }}
            onMouseUp={(evt) => {
                if (
                    record.current.startX - record.current.curX === 0 &&
                    record.current.startY - record.current.curY === 0 &&
                    Date.now() - record.current.startTime <= 500
                ) {
                    onClick?.(evt);
                }
            }}
        >
            {children}
        </div>
    );
};

export default DragItem;
