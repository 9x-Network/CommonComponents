import classnames from 'classnames';
import type { Identifier } from 'dnd-core';
import React, { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import type { Component, ComponentDeclare } from '../../interface';
import { useContextHelper } from '../../utils';
import ComponentItem from './ComponentItem';
import useStyles from './style.style';

export type DropboxContainer = Component[];
export interface DropboxProps {
    container: DropboxContainer;
    title?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}
const Dropbox = ({ title, container, disabled, className, style }: DropboxProps) => {
    const { styles } = useStyles();
    const helper = useContextHelper();
    const componentsMap = useRef<Record<string, string>>({});

    useEffect(() => {
        componentsMap.current = (() => {
            return container.reduce((memo, current) => {
                return {
                    ...memo,
                    [current.id]: true,
                };
            }, {});
        })();
    }, [container]);

    const onDrop = (component: Component | ComponentDeclare, componentType: Identifier | null) => {
        if (componentType === 'library') {
            helper.pushComponent(component, { target: container });
        } else if (componentType === 'component') {
            helper.moveComponent(component as Component, { target: container });
        }
    };

    const [{ active }, drop] = useDrop<Component | ComponentDeclare, unknown, { active: boolean }>(
        () => ({
            accept: ['library', 'component'],
            canDrop: (item) => {
                return (
                    // && !currentCopy?.[name]?.length
                    !disabled && !componentsMap.current[item.id || '']
                );
            },
            drop: async (item, monitor) => {
                if (!monitor.isOver({ shallow: true })) return;
                onDrop(item, monitor.getItemType());
            },
            collect: (monitor) => ({
                active: monitor.isOver({ shallow: true }) && monitor.canDrop(),
            }),
        }),
        [container, disabled],
    );

    return (
        <div
            ref={drop}
            className={classnames(styles.group, { [styles.active]: active }, className)}
            style={style}
        >
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>
                {container.map((item) => (
                    <ComponentItem
                        container={container}
                        component={item}
                        key={item.id}
                        disabled={disabled}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dropbox;
