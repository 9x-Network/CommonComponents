import { Dropdown } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import React, { useMemo } from 'react';
import { getComponentDeclare } from '../../components';
import { useContextValue } from '../../context';
import type { Component } from '../../interface';
import { generateID, useContextHelper } from '../../utils';
import type { DropboxContainer } from './dropbox';

const ContextMenu = ({
    children,
    container,
    component,
    disabled,
}: {
    container: DropboxContainer;
    component: Component;
    disabled?: boolean;
    children: React.ReactNode;
}) => {
    const { clipBoardData, setClipBoardData } = useContextValue();
    const helper = useContextHelper();
    const isContainer = useMemo(
        () => getComponentDeclare(component.type)?.isContainer,
        [component],
    );

    const cloneComponent = (comp: Component) => {
        const clone = cloneDeep(comp);
        clone.id = generateID();
        return clone;
    };
    const handleMenuClick = (key: string) => {
        const paste = (offset = 0, wrapper: DropboxContainer = container) => {
            const index = wrapper.indexOf(component) + offset;
            helper.pushComponent(cloneComponent(clipBoardData!), {
                target: wrapper,
                index,
            });
        };
        switch (key) {
            case 'focus':
                helper.innerFocus(component);
                break;
            case 'remove':
                helper.removeComponent(component);
                break;
            case 'copy':
                setClipBoardData(component);
                break;
            case 'pasteBefore':
                paste();
                break;
            case 'pasteAfter':
                paste(1);
                break;
            case 'pasteInner':
                {
                    if (!component.children) component.children = [];
                    const wrapper = component.children as any;
                    paste(wrapper.length + 1, wrapper);
                }
                break;
            default:
                break;
        }
    };
    const content = useMemo(() => {
        const child = React.Children.only(children);
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
            // @ts-ignore
            onDoubleClick: () => {
                if (isContainer && !disabled) helper.innerFocus(component);
            },
        });
    }, [children, component, helper, isContainer, disabled]);
    return (
        <Dropdown
            menu={{
                items: [
                    ...(isContainer ? [{ key: 'focus', label: 'Focus On' }] : []),
                    { key: 'copy', label: 'Copy' },
                    ...(clipBoardData
                        ? [
                              {
                                  key: 'paste',
                                  label: 'Paste',
                                  children: [
                                      { key: 'pasteBefore', label: 'To before' },
                                      { key: 'pasteAfter', label: 'To after' },
                                      ...(isContainer
                                          ? [{ key: 'pasteInner', label: 'To inner' }]
                                          : []),
                                  ],
                              },
                          ]
                        : []),
                    { key: 'remove', label: 'Remove', danger: true },
                ],
                onClick: (evt) => handleMenuClick(evt.key),
                style: { minWidth: 100 },
            }}
            trigger={['contextMenu']}
            disabled={disabled}
        >
            {content}
        </Dropdown>
    );
};

export default ContextMenu;
