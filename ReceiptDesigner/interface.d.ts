import type { FormProps } from 'antd';
import type { NamePath } from 'rc-field-form/lib/interface';
import type React from 'react';
import type xmldoc from 'xmldoc';
import type { DesignerProps } from './designer';

type DefaultAttrs = {
    weight?: number;
    [key: string]: any;
};
// 元组件
export interface Component<
    TT = string,
    AT = DefaultAttrs,
    CT = string | Component[] | null | undefined,
> {
    id: string;
    type: TT;
    attrs?: AT;
    children?: CT;
}
// 打印联
export interface Copy {
    id: string;
    name: string;
    header?: Component[];
    body?: Component[];
    footer?: Component[];
}
// 组件基类
export interface ComponentDeclare<
    TT = string,
    AT = DefaultAttrs,
    CT = string | Component[] | null | undefined,
> extends Component<TT, AT, CT> {
    id?: string;
    icon: React.ReactNode;
    name: string;
    defaultAttrs?: AT | (() => AT);
    defaultContent?: CT | (() => CT);
    Property: React.FC<
        React.PropsWithChildren<
            React.PropsWithChildren<
                {
                    component: Component<TT, AT, CT> & {
                        attrs: AT;
                    };
                    onValuesChange?: (
                        changedValues?: {
                            attrs?: Partial<AT>;
                            children?: CT;
                        },
                        allValues?: {
                            attrs?: Partial<AT>;
                            children?: CT;
                        },
                    ) => void;
                    omitFields?: NamePath[];
                } & Omit<FormProps, 'onValuesChange' | 'initialValues'>
            >
        >
    >;
    View: React.FC<
        React.PropsWithChildren<
            React.PropsWithChildren<{ component: Component<TT, AT, CT> & { attrs: AT } }>
        >
    >;
    isContainer?: boolean;
    isVirtualTag?: boolean;
    toXml?: () => xmldoc.XmlElement;
}
export interface ValueType {
    name: string;
    lang: string;
    fontFamily?: string;
    fontScale?: string | number;
    id?: string;
    copies?: Copy[];
}

export type Groups = 'header' | 'body' | 'footer';

interface ContextType {
    value?: ValueType;
    disabled?: DesignerProps['disabled'];
    setValue: (value: ValueType) => void;
    mergeValue: (value: Partial<ValueType>) => void;
    selectedCopy?: string | null;
    setSelectedCopy: (id?: string) => void;
    currentCopy?: Copy | null;
    selectedComponent?: string | null;
    setSelectedComponent: (id?: string) => void;
    currentComponent?: Component | null;
    update: () => void;
    inners?: Component[];
    setInners: (container?: Component[]) => void;
    clipBoardData?: Component;
    setClipBoardData: (data: Component) => void;
}
