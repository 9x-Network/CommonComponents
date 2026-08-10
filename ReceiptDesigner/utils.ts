import cloneDeep from 'lodash/cloneDeep';
import { useCallback } from 'react';
import { useContextValue } from './context';
import type { Component, ComponentDeclare, Copy, Groups } from './interface';

export const GroupNames: Groups[] = ['header', 'body', 'footer'];

export function generateID(prefix?: string): string {
    return (prefix || '') + Number(Math.random().toString().substr(3)).toString(36);
}

export function createComponent(cd: ComponentDeclare): Component {
    const getDynaPro = (prop: any) => {
        if (prop == null) return null;
        if (typeof prop === 'function') return prop();
        return cloneDeep(prop);
    };
    return {
        id: generateID(),
        type: cd.type,
        attrs: getDynaPro(cd.defaultAttrs) || {},
        children: getDynaPro(cd.defaultContent),
    };
}

export function eachComponents(
    copy: Copy,
    onItem?: (component: Component, parent: Component[], index: number) => boolean | void,
) {
    const each = (components: Component[]): boolean | void => {
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (onItem?.(component, components, i) === false) {
                return false;
            }
            if (component.children && Array.isArray(component.children)) {
                each(component.children);
            }
        }
        return true;
    };
    const groups = [copy.header, copy.body, copy.footer];
    for (let i = 0; i < groups.length; i++) {
        const components = groups[i];
        if (components?.length) {
            if (each(components) === false) break;
        }
    }
}

/**
 * Context helper
 * Easy to control the value of context
 */
export function useContextHelper() {
    const context = useContextValue();
    const { currentCopy, setSelectedComponent, update } = context;
    const pushComponent = useCallback(
        (
            component: Component | ComponentDeclare,
            options: { target: Component[] | Groups; index?: number },
        ): Component => {
            const copy = currentCopy!;
            const { target, index } = options;
            let list: Component[];
            if (typeof target === 'string') {
                if (!copy[target]) copy[target] = [];
                list = copy[target]!;
            } else {
                list = target;
            }
            const newItem: Component =
                'View' in component ? createComponent(component) : (component as Component);
            if (index != null && index >= 0) {
                list.splice(index, 0, newItem);
            } else {
                list.push(newItem);
            }
            update();
            setSelectedComponent(newItem.id);
            return newItem;
        },
        [context],
    );
    const removeComponent = useCallback(
        (component: Component, container?: Component[]) => {
            const copy = currentCopy!;
            const remove = () => {
                if (container) {
                    const index = container.findIndex((item) => item.id === component.id);
                    if (index >= 0) {
                        container.splice(index, 1);
                        return true;
                    }
                } else {
                    eachComponents(copy, (item, parent, index) => {
                        if (component.id === item.id) {
                            parent.splice(index, 1);
                            return false;
                        }
                        return true;
                    });
                }
                return false;
            };
            remove();
            update();
        },
        [context],
    );
    const moveComponent = useCallback(
        (
            component: Component,
            options: {
                target: Component[] | Groups;
                index?: number;
            },
        ) => {
            const copy = currentCopy!;
            const { target, index } = options;
            // 从旧的group删除
            removeComponent(component);
            // 复制到新的group
            let list: Component[];
            if (typeof target === 'string') {
                if (!copy[target]) copy[target] = [];
                list = copy[target]!;
            } else {
                list = target;
            }
            if (index != null && index >= 0) {
                list.splice(index, 0, component);
            } else {
                list.push(component);
            }
            update();
            return component;
        },
        [context],
    );
    const getComponentGroup = useCallback(
        (component: Component): { name: Groups; list: Component[] } | null => {
            const copy = currentCopy!;
            for (let i = 0; i <= GroupNames.length; i++) {
                const g = GroupNames[i];
                const components = copy[g] || [];
                if (components.some((item) => item.id === component.id)) {
                    return { name: g, list: components };
                }
            }
            return null;
        },
        [context],
    );
    const innerFocus = useCallback(
        (component: Component) => {
            setSelectedComponent();
            context.setInners([...(context.inners || []), component]);
        },
        [context],
    );
    return {
        context,
        pushComponent,
        moveComponent,
        removeComponent,
        getComponentGroup,
        innerFocus,
    };
}
