import MenuIcon from '@/components/MenuIcon';
import { parseJSONSafety } from '@/utils/utils';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { getLocale } from '@umijs/max';
import jexl from 'jexl';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import joinPath from 'url-join';

export type Key = string | number;

export type MenuTypes = 'Folder' | 'Menu' | 'Action' | 'StatusBar';

export type MenuItem = {
    id: number;
    name: string | AnyObject;
    type: MenuTypes;
    dnaStr: string;
    dna: number[];
    icon?: string;
    status?: number;
    path: string;
    route: string;
    backendPath?: string;
    description?: string;
    children?: MenuItem[];
    updateTime?: string;
    conditions?: string;
};

export type MenuList = MenuItem[] & {
    pathMap?: Record<string, MenuItem>;
    dnaMap?: Record<string, MenuItem>;
};
/**
 *  菜单资源字段转换映射，使字段名一致
 */
export const MenuResPropsMap = {
    backend_res_path: 'backendPath',
    frontend_res_path: 'path',
    res_type: 'type',
    res_name: 'name',
    dna: 'dnaStr',
};

/**
 * 遍历菜单树或菜单数组
 * @param menu
 * @param callback
 */
export function loop(
    menu: MenuList,
    callback: (
        item: MenuItem,
        index: number,
        parent: MenuItem | undefined,
        arr: MenuItem[],
    ) => boolean | void,
): MenuList {
    let shouldStop: boolean = false;

    function doEach(data: MenuList, parent?: MenuItem) {
        for (let i = 0; i < data.length; i++) {
            if (shouldStop) break;
            const item = data[i];
            const rs = callback(item, i, parent, data);
            if (rs === false) {
                shouldStop = true;
                break;
            }
            if (item.children) {
                doEach(item.children, item);
            }
        }
    }

    doEach(menu);
    return menu;
}

/**
 * 将平面的带有DNA的菜单数组转化为对象树
 * @param tileData
 */
export function planToTree(tileData: MenuList): MenuList {
    const tree: { children: MenuList } = { children: [] };
    tileData.forEach((item) => {
        const dna = item.dnaStr || '0';
        const chain = dna.split('-');
        item.dna = [];
        chain.forEach((key: string) => {
            item.dna.push(+key);
        });
        let cursor: any = tree;
        item.dna.forEach((index: number) => {
            if (!cursor.children) {
                cursor.children = [];
            }
            const { children } = cursor;
            if (!children[index]) {
                children[index] = {} as any;
            }
            cursor = cursor.children[index];
        });
        Object.assign(cursor, item);
    });
    // 移除空的对象
    const removeEmpties = (list: MenuList) => {
        const clearList = list.filter((item) => !!item);
        clearList.forEach((item) => {
            if (item.children) {
                item.children = removeEmpties(item.children);
            }
        });
        return clearList;
    };
    tree.children = removeEmpties(tree.children);

    return tree.children;
}

/**
 * 将菜单树展开为平面数组
 * @param menus
 */
export function treeToPlan(menus: MenuList): MenuList {
    const list: MenuList = [];
    loop(menus, (item) => {
        const cloneItem = cloneDeep(item);
        delete cloneItem.children;
        list.push(cloneItem);
    });
    return list;
}

/**
 * 当树结构发生了变化后对变化后的树的DNA进行重新排序以保证DNA和数结构的一致
 * @param menus
 */
export function recombineTreesDNA(menus: MenuList) {
    loop(menus, (item, index, parent) => {
        const dna = parent ? parent.dna : [];
        const newDna = [...dna, index];
        item.dna = newDna;
        item.dnaStr = newDna.join('-');
    });
    return extendResourceMenuMapping(menus);
}

/**
 * 转换资源数据菜单的数据并扩展映射
 * @param menus
 * @param opts
 */
export function convertResourceMenu(menus: MenuList, opts: { mergePath?: boolean } = {}): MenuList {
    const { mergePath = true } = opts;
    loop(menus, (menu, index, parent) => {
        // if(!menu)return;
        if (mergePath) {
            const parentPath = parent && parent.path ? parent.path : '';
            const childPath = menu && menu.path ? menu.path : '';
            try {
                menu.path = parentPath
                    ? joinPath('/', parentPath, childPath)
                    : joinPath('/', childPath);
            } catch (err) {
                // Defensive fallback: if joinPath throws (e.g., undefined parts), preserve a safe string
                // and log for diagnostics.
                // Keep menu.path as a string so subsequent code doesn't blow up.
                // eslint-disable-next-line no-console
                console.warn('convertResourceMenu: failed to join menu.path', {
                    parentPath,
                    childPath,
                    err,
                });
                menu.path = typeof childPath === 'string' && childPath ? childPath : '/';
            }
        }
        menu.name = parseJSONSafety(menu.name, {});
    });
    return extendResourceMenuMapping(menus);
}

/**
 *
 * 菜单附加条件过滤
 * @param menus
 * @param conditionScope
 * @returns
 */
export function analysisMenuConditions(menus: MenuList, conditionScope: AnyObject): MenuList {
    loop(menus, (menu) => {
        if (menu.conditions) {
            try {
                const conditionStr = menu.conditions.replace(/(\/\/.*)?|(\/\*[\s\S]*?\*\/)/g, '');
                const bool = jexl.evalSync(conditionStr, conditionScope);
                console.log('Exec condition', conditionStr, conditionScope, bool);
                if (!bool) {
                    menu.status = -1;
                }
            } catch (err) {
                menu.status = -1;
                console.error(err);
            }
        }
        menu.name = parseJSONSafety(menu.name, {});
    });
    return menus;
}

/**
 * 扩展menu的Map映射
 * @param menus
 */
export function extendResourceMenuMapping(menus: MenuList): MenuList {
    const routeMap: AnyObject = {};
    const dnaMap: AnyObject = {};
    loop(menus, (menu) => {
        routeMap[menu.path || ''] = menu;
        dnaMap[menu.dnaStr] = menu;
    });
    menus.pathMap = routeMap;
    menus.dnaMap = dnaMap;
    return menus;
}

/**
 * 转换菜单为渲染菜单配置项
 * @param menus
 */
export function convertMenuToMenuRenderData(menus: MenuList): MenuDataItem[] {
    return menus.map((menu) => {
        const IconComp: React.ComponentClass | string = menu.icon
            ? MenuIcon.Icons[menu.icon] || menu.icon
            : null;
        let icon;
        if (IconComp) {
            if (typeof IconComp === 'string') {
                icon = IconComp;
            } else {
                icon = React.createElement(IconComp);
            }
        }
        let name = menu.name;
        if (typeof name === 'object') {
            name = name[getLocale()] || name['en-US'];
        }
        return {
            icon,
            name,
            locale: false,
            path: menu.path,
            children: menu.children ? convertMenuToMenuRenderData(menu.children) : undefined,
            hideInMenu: menu.status != 1 || !['Menu', 'Folder'].includes(menu.type),
        } as MenuDataItem;
    });
}

/**
 * 获取第一个可访问的或指定可访问的菜单资源地址
 * @param menus
 * @param path
 */
export function getFirstAccessibleMenu(menus: MenuList, path?: string): MenuItem | null {
    let foundMenu: MenuItem | null = null;
    const { pathMap = {} } = menus;
    const checkIsAccessible = (m: MenuItem) => {
        return m.status == 1 && m.type === 'Menu' && !/:/.test(m.path);
    };
    const menu =
        path && path !== '/' && path !== ''
            ? pathMap[path.replace(/\/$/, '')]
            : Object.values(pathMap).find((m) => checkIsAccessible(m));
    if (!menu) return null;
    if (checkIsAccessible(menu)) return menu;
    loop(menu.children || [], (item) => {
        if (checkIsAccessible(item)) {
            foundMenu = item;
            return false;
        }
        return true;
    });
    return foundMenu;
}

/**
 * 获取第一个可访问的或指定可访问的菜单资源地址
 * @param menus
 * @param menuId
 */
export function getMenuById(menus: MenuList, menuId?: number | string): MenuItem | null {
    let foundMenu: MenuItem | null = null;
    loop(menus, (item) => {
        if (item.status == 1 && menuId == item.id) {
            foundMenu = item;
            return false;
        }
        return true;
    });
    return foundMenu;
}

/**
 * 转换为不包含父节点的对象树
 * @param list
 * @param menus
 */
export function unCompriseParentTree(list: any[] | undefined, menus: MenuList | undefined) {
    const newList: Key[] = [];
    if (!list?.length || !menus?.length) return newList;
    if (!menus.dnaMap) throw new Error('Can not find dna map, may be not extended!');
    const dnaMap = menus.dnaMap || {};
    const dnaList: string[] = list.map((item) => item.dnaStr || item.dna);
    dnaList
        .sort((a, b) => (a.length < b.length ? 1 : -1))
        .forEach((item) => {
            dnaList.forEach((dna, index) => {
                if (
                    dna?.length === 1 ||
                    (item && dna && item !== dna && item.startsWith(`${dna}-`))
                ) {
                    dnaList.splice(index, 1);
                }
            });
        });
    dnaList.forEach((dna) => {
        if (!dna || !dnaMap[dna]) return;
        const menu = dnaMap[dna];
        newList.push(menu.id);
    });
    return newList;
}

/**
 * 使对象树包含父节点
 * @param list
 * @param menus
 */
export function compriseParentTree(list: Key[] | undefined, menus: MenuList): Key[] {
    const newList: Key[] = [];
    if (!list?.length) return newList;
    if (!menus.dnaMap) throw new Error('Can not find dna map, may be not extended!');
    const dnaMap = menus.dnaMap || {};
    const menusList = Object.values(dnaMap);
    list.forEach((id) => {
        const m = menusList.find((item) => item.id === id);
        if (!m) return;
        if (newList.indexOf(id) === -1) newList.push(id);
        if (m.dna.length > 1) {
            // DNA链大于1则说明有父节点
            const chain = [...m.dna];
            while (chain.length > 1) {
                chain.pop();
                const dna = chain.join('-');
                const pid = dnaMap[dna].id;
                if (newList.indexOf(pid) === -1) {
                    newList.push(pid);
                }
            }
        }
    });
    return newList;
}
