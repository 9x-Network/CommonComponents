import { useControllableValue } from 'ahooks';
import classNames from 'classnames';
import merge from 'lodash/merge';
import React, { useCallback, useMemo, useState } from 'react';
import { DesignerContext } from './context';
import type { DesignerProps } from './designer';
import Designer from './designer';
import useStyles from './index.style';
import type { Component, ValueType } from './interface';
import type { ToolbarConfig } from './toolbar';
import Toolbar from './toolbar';
import { eachComponents } from './utils';
import { valueToXml, valueToXmlString, xmlToValue } from './xml';

export interface ReceiptDesignerProps extends DesignerProps {
    designerClassName?: string;
    designerStyle?: React.CSSProperties;
    toolbar?: ToolbarConfig | boolean;
}
const ReceiptDesigner = (props: ReceiptDesignerProps) => {
    const { styles } = useStyles();
    const {
        toolbar,
        className,
        style,
        designerStyle,
        designerClassName,
        onChange,
        disabled,
        ...rest
    } = props;
    const toolbarConfig: ToolbarConfig | null = useMemo(() => {
        if (toolbar === true || toolbar == null) return {};
        if (toolbar === false) return null;
        return toolbar;
    }, [toolbar]);

    const [value, setValue] = useControllableValue<ValueType>(props, {});
    const [selectedCopy, setSelectedCopy] = useControllableValue<DesignerProps['selectedCopy']>(
        props,
        {
            valuePropName: 'selectedCopy',
            defaultValuePropName: 'defaultSelectedCopy',
            trigger: 'onCopySelected',
        },
    );
    const [selectedComponent, setSelectedComponent] = useState<string | null>();
    const [clipBoardData, setClipBoardData] = useState<Component>();
    const [inners, setInners] = useState<Component[]>();
    const currentCopy = useMemo(() => {
        if (!selectedCopy) return null;
        return value?.copies?.find((n) => n.id === selectedCopy);
    }, [selectedCopy, value]);
    // 用组件id为key组成的map对象
    const valuesMap = useMemo(() => {
        const map: Record<string, Component> = {};
        if (currentCopy) {
            eachComponents(currentCopy, (item) => {
                map[item.id] = item;
            });
        }
        return map;
    }, [currentCopy, value]);

    const currentComponent = useMemo<Component | null | undefined>(() => {
        if (!selectedComponent) return null;
        return valuesMap[selectedComponent];
    }, [valuesMap, selectedComponent]);
    const updateValue = (val: ValueType) => {
        setValue(val);
        onChange?.(val);
    };
    const mergeValue = useCallback(
        (mergeVal: Partial<ValueType>) => {
            const newVal = merge({}, value, mergeVal);
            updateValue(newVal);
        },
        [value],
    );

    return (
        <DesignerContext.Provider
            value={{
                value,
                setValue,
                mergeValue,
                selectedCopy,
                setSelectedCopy: (copy) => {
                    setSelectedComponent(null);
                    setSelectedCopy(copy);
                },
                currentCopy,
                selectedComponent,
                setSelectedComponent,
                currentComponent,
                update: () => {
                    updateValue({ ...value });
                },
                disabled,
                inners,
                setInners,
                clipBoardData,
                setClipBoardData,
            }}
        >
            <div className={classNames(className, styles.container)} style={style}>
                {toolbarConfig && <Toolbar config={toolbarConfig} />}
                <Designer className={designerClassName} style={designerStyle} {...rest} />
            </div>
        </DesignerContext.Provider>
    );
};

ReceiptDesigner.toXml = valueToXml;
ReceiptDesigner.toXmlString = valueToXmlString;
ReceiptDesigner.formXml = xmlToValue;

export default ReceiptDesigner;
