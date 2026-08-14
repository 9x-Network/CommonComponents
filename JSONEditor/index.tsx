import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import df from 'deep-diff';
import type { JSONEditorOptions } from 'jsoneditor';
import Editor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import type { CSSProperties } from 'react';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getLocale } from '@umijs/max';

export type JSONEditorInstance = Editor & {
    menu: HTMLDivElement;
    container: HTMLDivElement;
    validate: () => Promise<{ line: number; message: string; type: string }[]>;
    errorTable: {
        dom: {
            additionalErrorsIndication?: HTMLDivElement;
            parseErrorIndication?: HTMLSpanElement;
            validationErrorCount?: HTMLSpanElement;
            validationErrorIcon?: HTMLSpanElement;
            validationErrorsContainer?: HTMLDivElement;
        };
    };
};

export interface JSONEditorProps extends Omit<JSONEditorOptions, 'onChange'> {
    value?: any;
    defaultValue?: any;
    disabled?: boolean;
    onChange?: (value?: AnyObject | null | undefined | '') => void;
    style?: CSSProperties;
    className?: string;
}

/**
 * JSON编辑器表单组件
 */
const JsonEditor = React.forwardRef<JSONEditorInstance | undefined, JSONEditorProps>(
    (props, ref) => {
        const {
            mode = 'code',
            defaultValue,
            value = defaultValue,
            schema,
            className,
            style,
            onEditable,
            onChange,
            disabled,
            ...rest
        } = props;
        const containerRef = useRef<HTMLDivElement>(null);
        const editor = useRef<JSONEditorInstance>();
        const valueRef = useRef<any>(value);
        const [ready, setReady] = useState<boolean>(false);

        const expandFullScreenMenu = (je: JSONEditorInstance) => {
            const wrap = document.createElement('div');
            je.menu.appendChild(wrap);
            const root = createRoot(wrap);
            root.render(<FullScreenModeButton editor={je} />);
        };

        useImperativeHandle(ref, () => editor.current, [ready]);

        useEffect(() => {
            const language = getLocale().split('-')[0];
            if (containerRef.current) {
                const editorIns: JSONEditorInstance = new Editor(
                    containerRef.current,
                    {
                        modes: ['code', 'form', 'text', 'tree', 'view'],
                        language,
                        mode,
                        schema,
                        ...rest,
                        onEditable: (node: any) => {
                            if (onEditable) return onEditable(node);
                            if (disabled) return false;
                            return node;
                        },
                        onChange: () => {
                            if (onChange) {
                                const text = editorIns.getText();
                                if (text === '') {
                                    onChange('');
                                    return;
                                }
                                editorIns.validate().then((errors) => {
                                    if (!errors.length) {
                                        try {
                                            const currentJson = editorIns.get();
                                            if (value !== currentJson) {
                                                onChange(currentJson);
                                            }
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }
                                });
                            }
                        },
                    },
                    value,
                ) as JSONEditorInstance;
                editor.current = editorIns;
                expandFullScreenMenu(editorIns);
                setReady(true);
            }
            return () => {
                editor.current?.destroy();
            };
        }, []);
        useEffect(() => {
            if (editor.current && value !== valueRef.current) {
                try {
                    const json = editor.current.get();
                    if (df.diff(json, value)) {
                        editor.current.update(value);
                    }
                } catch (e) {
                    // do nothing
                }
            }
            valueRef.current = value;
        }, [value]);
        useEffect(() => {
            editor.current?.setMode(mode);
            editor.current?.setSchema(schema || {});
        }, [mode, schema]);
        return <div className={className} style={style} ref={containerRef} />;
    },
);

function FullScreenModeButton({ editor }: { editor: JSONEditorInstance }) {
    const [isFull, setIsFull] = useState<boolean>(!!document.fullscreenElement);
    useEffect(() => {
        const onfullscreenchange = () => {
            setIsFull(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onfullscreenchange);
        return () => {
            document.removeEventListener('fullscreenchange', onfullscreenchange);
        };
    }, []);
    return (
        <Button
            type={'text'}
            icon={
                isFull ? (
                    <FullscreenExitOutlined style={{ color: '#fff' }} />
                ) : (
                    <FullscreenOutlined style={{ color: '#fff' }} />
                )
            }
            onClick={() => {
                if (isFull) {
                    document.exitFullscreen();
                } else {
                    editor.container.requestFullscreen();
                }
            }}
        />
    );
}

export default JsonEditor;
