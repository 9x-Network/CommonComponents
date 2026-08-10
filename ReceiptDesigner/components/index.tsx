import type { ComponentDeclare } from '../interface';
import barcode from './barcode';
import image from './image';
import qrcode from './qrcode';
import repeat from './repeat';
import row from './row';
import separator from './separator';
import text from './text';

export const list: ComponentDeclare<any, any, any>[] = [
    row,
    repeat,
    text,
    image,
    qrcode,
    barcode,
    separator,
];

type GroupList = {
    containers: ComponentDeclare<any, any, any>[];
    components: ComponentDeclare<any, any, any>[];
};
export const groupedList: GroupList = list.reduce(
    (obj, comp) => {
        if (comp.isContainer) {
            obj.containers.push(comp);
        } else {
            obj.components.push(comp);
        }
        return obj;
    },
    { containers: [], components: [] } as GroupList,
);
export const map = list.reduce((obj, comp) => {
    return { ...obj, [comp.type]: comp };
}, {});
export function getComponentDeclare(type: string): ComponentDeclare<string, any> | undefined {
    return map[type];
}
