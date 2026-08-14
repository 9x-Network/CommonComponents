import { useUser } from '@/models/user';
import { getRemoteFile } from '@/services/basis';
import { getRequestCommonHeaders, getRequestUrl } from '@/utils/request';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Boot, i18nChangeLanguage } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import attachmentModule from '@wangeditor/plugin-upload-attachment';
import { useControllableValue } from 'ahooks';
import { message, Modal } from 'antd';
import classnames from 'classnames';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useIntl } from '@umijs/max';
import SourceCode from './menus/SourceCode';
import useStyles from './RichTextEditor.style';

export type RichTextEditorProps = {
    value?: string;
    defaultValue?: string;

    style?: React.CSSProperties;
    className?: string;
    containerClassName?: string;
    containerStyle?: React.CSSProperties;
    toolbarClassName?: string;
    toolbarStyle?: React.CSSProperties;
    height?: number;
    mode?: string;

    autofocus?: boolean;
    onFocus?: IEditorConfig['onFocus'];
    onBlur?: IEditorConfig['onBlur'];
    onCreated?: IEditorConfig['onCreated'];
    onDestroyed?: IEditorConfig['onDestroyed'];
    onChange?: (html: string) => void;

    customAlert?: IEditorConfig['customAlert'];

    excludeMenuKeys?: string[];

    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    ref?: React.Ref<IDomEditor>;
};

export type RichTextEditorRef = IDomEditor;

// 自定义源代码插件
Boot.registerMenu({
    key: 'sourceCode',
    factory() {
        return new SourceCode();
    },
});
// 文件上传插件
Boot.registerModule(attachmentModule);

const RichTextEditor = React.forwardRef<RichTextEditorRef, RichTextEditorProps>((props, ref) => {
    const defaultCustomAlert = (s: string, t: string) => {
        switch (t) {
            case 'success':
                message.success(s);
                break;
            case 'info':
                message.info(s);
                break;
            case 'warning':
                message.warning(s);
                break;
            case 'error':
                message.error(s);
                break;
            default:
                message.info(s);
                break;
        }
    };
    const {
        style,
        className,
        containerStyle,
        containerClassName,
        toolbarClassName,
        toolbarStyle,
        mode = 'default',
        customAlert = defaultCustomAlert,
        onFocus,
        onBlur,
        onCreated,
        onDestroyed,
        autofocus = false,
        height,
        disabled,
        placeholder,
        maxLength,
        excludeMenuKeys = [],
    } = props;

    const { locale, formatMessage } = useIntl();
    const { currentUser } = useUser();
    const [value, setValue] = useControllableValue(props);
    const [editor, setEditor] = useState<IDomEditor | null>(null);

    const initUploadConfig = (option?: Record<string, any>) => {
        return {
            server: getRequestUrl(`bis/${AppPkgName}/file/upload`),
            fieldName: 'file_data',
            maxFileSize: 5 * 1024 * 1024, // 默认文件大小5M
            // base64LimitSize: 5 * 1024, // 5kb
            meta: {
                file_id: 1,
            },
            withCredentials: true,
            timeout: 0,
            headers: getRequestCommonHeaders(currentUser),
            customInsert(res: any, arg1: any, arg2: any) {
                if (res.code != '0') {
                    message.error(res.msg);
                    return;
                }
                // 图片视频上传回调参数在第二个
                if (typeof arg1 === 'function') {
                    arg1(getRemoteFile(res.data.file_key, { inline: true }));
                } else if (typeof arg2 === 'function') {
                    // 附件上传回调参数在第三个
                    arg2(arg1.name, getRemoteFile(res.data.file_key, { inline: true }));
                }
            },
            // 上传错误，或者触发 timeout 超时
            onError(file: File, err: any, res: any) {
                const errors = [err?.message, err?.request?.status, err?.request?.statusText];
                Modal.error({
                    title: formatMessage({ id: 'common.operateFail' }),
                    content: errors.join('::'),
                });
                console.log(`${file.name} 上传出错`, err, res);
            },
            ...option,
        };
    };
    // 菜单配置
    const MENU_CONF = {
        uploadImage: initUploadConfig(),
        uploadVideo: initUploadConfig(),
        uploadAttachment: initUploadConfig(),
    };
    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {
        excludeKeys: excludeMenuKeys,
        insertKeys: {
            index: 62,
            keys: ['uploadAttachment', 'sourceCode'],
        },
    };
    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder,
        autoFocus: autofocus,
        onFocus,
        onBlur,
        onCreated,
        onDestroyed,
        readOnly: disabled,
        maxLength,
        customAlert,
        MENU_CONF,
    };
    const { styles } = useStyles();
    useImperativeHandle(ref, () => editor!, [editor]);
    // 多语言切换，暂时只支持中文和英文
    useEffect(() => {
        i18nChangeLanguage(locale === 'zh-CN' ? 'zh-CN' : 'en');
    }, [locale]);
    // disable状态切换
    useEffect(() => {
        if (disabled) {
            editor?.disable();
        } else {
            editor?.enable();
        }
    }, [disabled]);
    // 组件销毁时销毁editor
    useEffect(() => {
        return () => {
            editor?.destroy();
        };
    }, []);

    return (
        <div className={classnames(styles.container, containerClassName)} style={containerStyle}>
            <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode={mode}
                className={classnames(styles.toolbar, toolbarClassName)}
                style={toolbarStyle}
            />

            <Editor
                defaultConfig={editorConfig}
                value={value}
                onCreated={setEditor}
                onChange={(ins) => setValue(ins.getHtml())}
                mode={mode}
                className={className}
                style={{ ...style, height }}
            />
        </div>
    );
});

export default RichTextEditor;
