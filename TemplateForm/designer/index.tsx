import JsonEditor from '@/components/common/JSONEditor';
import { useControllableValue } from 'ahooks';
import { Form } from 'antd';
import React, { useState } from 'react';
import { DesignerContext } from './context';
import Copy from './navbar/copy';
import FormCheck from './navbar/formCheck';
import ModeNavbar from './navbar/mode';
import Preview from './navbar/preview';
import useStyles from './style.style';
import Visual from './Visual';

export type Mode = 'visual' | 'source';

export interface DesignerProps {
    className?: string;
    style?: React.CSSProperties;
    mode?: Mode;
    defaultMode?: Mode;
    onModeChange?: (mode: Mode) => void;
    value?: any;
    defaultValue?: any;
    onChange?: (value?: any) => void;
    disabled?: boolean;
}

const Designer = (props: DesignerProps) => {
    const { styles } = useStyles();
    const { className, style, disabled } = props;
    const [workForm] = Form.useForm();
    const [controlForm] = Form.useForm();
    const [value, setValue] = useControllableValue(props);
    const [mode, setMode] = useControllableValue<Mode>(
        {
            value: props.mode,
            defaultValue: props.defaultMode,
            onChange: props.onModeChange,
        },
        {
            valuePropName: 'mode',
            defaultValue: 'visual',
            defaultValuePropName: 'defaultMode',
        },
    );
    const [selected, setSelected] = useState<string>();
    return (
        <DesignerContext.Provider
            value={{
                value,
                setValue,
                disabled,
                mode,
                setMode,
                selected,
                setSelected,
                workForm,
                controlForm,
            }}
        >
            <div className={className} style={style}>
                <div className={styles.navbar}>
                    <ModeNavbar />
                    <Preview />
                    <FormCheck />
                    <Copy />
                </div>
                {mode === 'source' && (
                    <JsonEditor
                        value={value}
                        onChange={setValue}
                        style={{ height: '100%' }}
                        disabled={disabled}
                        defaultValue={[]}
                    />
                )}
                {mode === 'visual' && <Visual />}
            </div>
        </DesignerContext.Provider>
    );
};

export default Designer;
