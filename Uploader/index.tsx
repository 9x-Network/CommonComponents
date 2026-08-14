import { getRequestCommonHeaders, getRequestUrl } from '@/utils/request';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { UploadProps } from 'antd/lib/upload';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import type { MutableRefObject } from 'react';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Viewer from 'react-viewer';
import type { ImageDecorator } from 'react-viewer/lib/ViewerProps';
import { useIntl } from '@umijs/max';

export type UploaderProps = {
    children?: React.ReactNode;
    value?: string | string[];
    defaultValue?: string | string[];
    onChange?: (value: string | string[] | undefined) => void;
    onUploadChange?: (info: UploadChangeParam) => void;
    onUploadFinish?: (files: UploadFile[]) => void;
    onUploadError?: (file: UploadFile, files: UploadFile[]) => void;
    onGetFileKey?: (response: UploadFile) => string;
    downloadPrefix?: string;
    drag?: boolean;
    ref?: MutableRefObject<any>;
    fileId?: string | number;
    defaultFileList?: UploadFile[];
} & Omit<UploadProps, 'onChange' | 'fileList' | 'defaultFileList'>;

/**
 * 上传组件
 * 基于内部业务包装的上传组件
 */
const Uploader = React.forwardRef((props: UploaderProps, ref) => {
    const { formatMessage } = useIntl();
    const renderDefaultChildren = () => (
        <Button>{formatMessage({ id: 'components.uploader.upload' })}</Button>
    );
    const {
        children = renderDefaultChildren(),
        action: _action = `bis/${AppPkgName}/file/upload/`,
        downloadPrefix = `bis/${AppPkgName}/file/download/`,
        name = 'file_data',
        withCredentials = true,
        fileId = 1,
        drag,
        value,
        defaultValue,
        onChange: propOnChange,
        onUploadChange,
        onRemove,
        onUploadFinish,
        onUploadError,
        multiple,
        maxCount,
        onGetFileKey = (file) => file.response?.data?.file_key || file.uid,
        headers = {},
        data = {},
        ...rest
    } = props;
    const [commonHeaders] = useState(getRequestCommonHeaders());
    let action = _action;
    const onChange = (val: string | string[]) => {
        if (!multiple && Array.isArray(val)) {
            return propOnChange?.(val[0] || '');
        }
        return propOnChange?.(val);
    };
    if (typeof action === 'string') action = getRequestUrl(action);
    const [fileList, setFileList] = React.useState<UploadFile[]>(props.defaultFileList || []);
    const syncValue2FileList = (val?: string | string[]) => {
        if (val) {
            if (multiple && !Array.isArray(val)) {
                throw new TypeError('The value must be an array when multiple is true');
            }
            if (!multiple && Array.isArray(val)) {
                throw new TypeError('The value can not be an array when multiple is false');
            }
        }
        let fileKeys: string[];
        if (!val) {
            fileKeys = [];
        } else if (multiple) {
            fileKeys = val as string[];
        } else {
            fileKeys = [val] as string[];
        }
        setFileList(
            fileKeys.map((v) => ({
                size: -1,
                type: '',
                uid: v,
                url: getRequestUrl(downloadPrefix || '', v),
                thumbUrl: getRequestUrl(downloadPrefix || '', v),
                name: v,
                status: 'done',
            })),
        );
    };
    useEffect(() => {
        syncValue2FileList(value);
    }, [value]);
    useEffect(() => {
        if (defaultValue !== undefined) {
            syncValue2FileList(defaultValue);
        }
    }, []);
    const onChangeEvent = (info: UploadChangeParam) => {
        const extFileProps = (file: UploadFile) => {
            file.uid = file.name = onGetFileKey(file);
            file.thumbUrl = file.url = getRequestUrl(downloadPrefix || '', file.uid);
        };
        onUploadChange?.(info);
        info.fileList.forEach((file) => {
            if (file.response && file.status === 'done') extFileProps(file);
        });
        setFileList(info.fileList);
        if (info.file.status === 'done') {
            if (info.file.response.code != 0) {
                if (onUploadError) {
                    onUploadError(info.file, info.fileList);
                } else {
                    message.error(info.file.response.msg);
                }
                setFileList(info.fileList.filter((file) => file.uid !== info.file.uid));
                onUploadFinish?.(info.fileList);
                return;
            }
            extFileProps(info.file);
            if (multiple) {
                if (!info.fileList.find((item) => item.status !== 'done')) {
                    onChange?.(info.fileList.map((f) => f.uid));
                    onUploadFinish?.(info.fileList);
                }
            } else {
                onChange?.(info.file.uid);
                onUploadFinish?.(info.fileList);
            }
        } else if (info.file.status === 'removed') {
            onUploadFinish?.(info.fileList);
        }
    };
    const onRemoveEvent = (file: UploadFile) => {
        if (fileList) {
            const newList = fileList.filter((item) => item.uid !== file.uid);
            setFileList(newList);
            onChange?.(newList.map((a) => a.uid));
        }
    };
    const UploadComp = drag ? Upload.Dragger : Upload;
    return (
        <UploadComp
            onChange={onChangeEvent}
            onRemove={onRemoveEvent}
            fileList={fileList}
            action={action}
            multiple={multiple}
            maxCount={maxCount}
            headers={{ ...commonHeaders, ...headers } as any}
            data={{ file_id: fileId, ...data }}
            name={name}
            withCredentials={withCredentials}
            {...rest}
            ref={ref}
        >
            {children}
        </UploadComp>
    );
}) as UploaderType;

export type ImageUploaderProps = {
    viewerClassName?: string;
} & Omit<UploaderProps, 'listType' | 'showUploadList'>;

/**
 * 上传组件图片上传
 */
const ImageUploader = React.forwardRef((props: ImageUploaderProps, ref) => {
    const { value, accept = 'image/*', viewerClassName, children, ...rest } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<{ index?: number; images: ImageDecorator[] }>();
    const uploadRef = useRef<any>(null);
    const { formatMessage } = useIntl();
    useImperativeHandle(ref, () => uploadRef.current, [uploadRef.current]);
    const uploadButton = useMemo(() => {
        if (loading) return null;
        if (props.multiple) {
            if (props.maxCount && value?.length && value.length >= props.maxCount) {
                return null;
            }
        } else if (value) {
            return null;
        }
        return (
            children || (
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>
                        {formatMessage({ id: 'components.uploader.upload' })}
                    </div>
                </div>
            )
        );
    }, [value, loading, props.multiple, props.maxCount, children]);
    const beforeUpload = (file: RcFile, FileList: RcFile[]) => {
        setLoading(true);
        return props.beforeUpload?.(file, FileList) || true;
    };
    const onUploadFinish = (files: UploadFile[]) => {
        setLoading(false);
        props.onUploadFinish?.(files);
    };
    const onPreview = (file: UploadFile) => {
        const images: ImageDecorator[] =
            uploadRef.current?.fileList?.map((f: UploadFile) => ({
                src: f.url,
                alt: f.uid,
            })) || [];
        const index = images.findIndex((img) => img.alt === file.uid);
        setPreview({ index: Math.max(0, index), images });
    };
    return (
        <>
            <Uploader
                accept={accept}
                value={value}
                {...rest}
                listType={'picture-card'}
                beforeUpload={beforeUpload}
                onUploadFinish={onUploadFinish}
                onPreview={onPreview}
                ref={uploadRef}
            >
                {uploadButton}
            </Uploader>
            {preview && (
                <Viewer
                    visible
                    onClose={() => {
                        setPreview(undefined);
                    }}
                    images={preview.images}
                    activeIndex={preview.index}
                    className={viewerClassName}
                />
            )}
        </>
    );
});

export type UploaderType = {
    ImageUploader: typeof ImageUploader;
} & React.ForwardRefExoticComponent<UploaderProps>;

Uploader.ImageUploader = ImageUploader;

export default Uploader;
