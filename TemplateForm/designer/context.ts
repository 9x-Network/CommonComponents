import type { FormInstance } from 'antd/lib/form';
import type { NamePath } from 'rc-field-form/lib/interface';
import React from 'react';
import type { TemplateConfig } from '../FormItem';
import type { Mode } from './index';

export interface FieldItem {
    type: string;
    name: NamePath;
}

export type ContextType = {
    value?: TemplateConfig[];
    setValue: (value?: any) => void;
    disabled?: boolean;
    mode: Mode;
    setMode: (mode: Mode) => void;
    selected?: string;
    setSelected: (name?: string) => void;
    workForm: FormInstance;
    controlForm: FormInstance;
};

export const DesignerContext = React.createContext<ContextType>({} as ContextType);

export function useDesignerContext() {
    return React.useContext(DesignerContext);
}
