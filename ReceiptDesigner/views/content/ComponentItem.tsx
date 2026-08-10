import classnames from 'classnames';
import type { Identifier } from 'dnd-core';
import { useMemo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getComponentDeclare } from '../../components';
import { useContextValue } from '../../context';
import type { Component, ComponentDeclare } from '../../interface';
import { useContextHelper } from '../../utils';
import ContextMenu from './ContextMenu';
import type { DropboxContainer } from './dropbox';
import useStyles from './style.style';

export type ActivePosition = 'Before' | 'After' | null;
export interface ComponentItemProps {
    container: DropboxContainer;
    component: Component;
    disabled?: boolean;
}
const ComponentItem = ({ container, component, disabled }: ComponentItemProps) => {
    const { styles } = useStyles();
    const { selectedComponent, setSelectedComponent } = useContextValue();
    const helper = useContextHelper();
    const [activePosition, setActivePosition] = useState<ActivePosition>(null);
    const containerDiv = useRef<HTMLDivElement>(null);
    const componentDeclare = useMemo(() => getComponentDeclare(component.type), [component.type]);

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'component',
            item: component,
            canDrag: !disabled && component.id === selectedComponent,
            options: {
                dropEffect: 'move',
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [component, selectedComponent, disabled],
    );
    const onDrop = (comp: Component | ComponentDeclare, type: Identifier | null) => {
        let index = container.indexOf(component);
        if (activePosition === 'After') index += 1;
        index = Math.max(0, index);
        if (type === 'library') {
            helper.pushComponent(comp, {
                target: container,
                index,
            });
        } else if (type === 'component') {
            helper.moveComponent(comp as Component, {
                target: container,
                index,
            });
        }
    };
    const [{ active }, drop] = useDrop<Component | ComponentDeclare, unknown, { active: boolean }>(
        () => ({
            accept: ['library', 'component'],
            canDrop: (item) => {
                return !disabled && item.id !== component.id;
            },
            drop: async (item, monitor) => {
                if (!monitor.isOver({ shallow: true })) return;
                onDrop(item, monitor.getItemType());
            },
            collect: (monitor) => ({
                active: monitor.isOver({ shallow: true }) && monitor.canDrop(),
            }),
            hover(item, monitor) {
                const offset = monitor.getClientOffset();
                if (!containerDiv.current || !offset) return;
                const containerRect = containerDiv.current.getBoundingClientRect();
                const ccy = containerRect.y + containerRect.height / 2;
                const pos: ActivePosition = offset.y < ccy ? 'Before' : 'After';
                if (activePosition !== pos) {
                    setActivePosition(pos);
                }
            },
        }),
        [activePosition, disabled],
    );

    drag(drop(containerDiv.current));
    return (
        <ContextMenu
            container={container}
            component={component}
            disabled={disabled}
            key={component.id}
        >
            <div
                className={classnames(styles.component, {
                    [styles.selected]: selectedComponent === component.id,
                    [styles.active]: active,
                    [styles.dragging]: isDragging,
                    [styles.up]: active && activePosition === 'Before',
                    [styles.down]: active && activePosition === 'After',
                })}
                onMouseDown={() => {
                    setSelectedComponent(component.id);
                }}
                ref={containerDiv}
            >
                <div className={styles.arrow}>
                    <span className={styles.arrowContent} />
                </div>
                <div className={'inner'}>
                    {componentDeclare ? (
                        <componentDeclare.View component={component as any} />
                    ) : (
                        <span className={'text-danger'}>Unknown component</span>
                    )}
                </div>
            </div>
        </ContextMenu>
    );
};

export default ComponentItem;
