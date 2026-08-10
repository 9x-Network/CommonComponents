import { parseJSONSafety } from '@/utils/utils';
import { camelCase } from 'lodash';
import kebabCase from 'lodash/kebabCase';
import xmldoc from 'xmldoc';
import { getComponentDeclare } from './components';
import type { Component, ValueType } from './interface';
import { generateID } from './utils';

export function stringToXml(xml: string): xmldoc.XmlDocument {
    return new xmldoc.XmlDocument(xml);
}
export function getAttrs(el: xmldoc.XmlElement): Record<string, any> {
    const attrs = { ...el.attr };
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in attrs) {
        let value: any = attrs[key];
        // 特殊值转换
        if (value === 'false') value = false;
        if (value === 'true') value = true;
        if (value === 'null') value = null;
        // text的mappings需要转换为json对象
        if (el.name === 'text' && key === 'mappings') {
            value = parseJSONSafety(value);
        }
        // key转驼峰
        attrs[camelCase(key)] = value;
    }
    return attrs;
}
export function setAttrs(el: xmldoc.XmlElement, attributes: Record<any, any>, ignores?: string[]) {
    Object.keys(attributes).forEach((key) => {
        // 忽略_$开头的私有属性
        if (/^[_$]/.test(key)) return;
        // 忽略id属性
        if (ignores?.indexOf(key) === -1) return;
        let value = attributes[key];
        // null和undefined的值忽略
        if (value === null || value === undefined) return;
        if (el.name === 'text' && key === 'mappings') value = JSON.stringify(value);
        // key转换为下划线格式
        key = kebabCase(key);
        el.attr[key] = value;
    });
    return el;
}
export function createElement(tag: string, attr?: Record<any, any>): xmldoc.XmlElement {
    const el = new xmldoc.XmlElement({ name: tag, attributes: {} });
    if (attr) setAttrs(el, attr);
    return el;
}

export function componentToXml(component: Component): xmldoc.XmlElement {
    const cd = getComponentDeclare(component.type)!;
    if (cd.toXml) return cd.toXml();
    const el = createElement(component.type, component.attrs);
    if (component.children && !Array.isArray(component.children)) {
        el.children.push(new xmldoc.XmlCDataNode(String(component.children)));
    }
    return el;
}

export function valueToXml(value: ValueType): xmldoc.XmlDocument {
    const doc = new xmldoc.XmlDocument('<template>');
    const { copies, ...restValue } = value;
    setAttrs(doc, restValue);

    const transformComponents = (container: xmldoc.XmlElement, list: Component[]) => {
        list.forEach((comp) => {
            const compXml = componentToXml(comp);
            container.children.push(compXml);
            if (Array.isArray(comp.children)) {
                transformComponents(compXml, comp.children);
            }
        });
        return container;
    };
    if (copies) {
        copies.forEach((copy) => {
            const { header, body, footer, ...restCopy } = copy;
            const copyEl = createElement('copy', restCopy);
            doc.children.push(copyEl);
            if (header) {
                copyEl.children.push(transformComponents(createElement('header'), header));
            }
            if (body) {
                copyEl.children.push(transformComponents(createElement('body'), body));
            }
            if (footer) {
                copyEl.children.push(transformComponents(createElement('footer'), footer));
            }
        });
    }
    return doc;
}

export function valueToXmlString(value: ValueType): string {
    return valueToXml(value).toString();
}

export function xmlToValue(xml: xmldoc.XmlDocument | string): ValueType {
    const doc = typeof xml === 'string' ? stringToXml(xml) : xml;
    const value: any = {
        ...getAttrs(doc),
        copies: [],
    };
    if (!value.id) value.id = generateID();

    doc.eachChild((copyEl) => {
        const copy = getAttrs(copyEl);
        copyEl.eachChild((groupEl) => {
            copy[groupEl.name] = parseComponentList(groupEl);
        });
        value.copies.push(copy);
    });

    return value;
}

export function parseComponentList(el: xmldoc.XmlElement) {
    const group: Component[] = [];
    el.eachChild((compEl) => {
        const comp: Component = {
            id: generateID(),
            attrs: getAttrs(compEl),
            type: compEl.name,
        };
        if (getComponentDeclare(compEl.name)?.isContainer) {
            comp.children = parseComponentList(compEl);
        } else {
            comp.children = compEl.val;
        }
        group.push(comp);
    });
    return group;
}
